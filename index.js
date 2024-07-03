require("dotenv").config()
const { Client, Poll, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const { GROUP_IDs, imagePath, DISCORD_CHANNEL_ID } = require('./config/IDs');
const { getQuizData } = require('./helpers/getQuizData');
const { generateCodeSnippet } = require('./helpers/generateCodeSnippet');
const { writeToRedis, readFromRedis } = require("./config/upstash");
const cron = require('node-cron');
const qrcode = require('qrcode-terminal');
const { moveQuizStatusToDone } = require('./helpers/updateQuizStatus');
const { sendAMessageToDiscord, postPollToDiscord, getDiscordMessageById } = require("./helpers/discord");
const { preloadMessages } = require("./helpers/preloadMessages");

const client = new Client({
    puppeteer: {
        headless: true,
        ignoreHTTPSErrors: true,
        args: [
            "--window-size=1300,1000",
            "--disable-notifications",
            "--disable-gpu",
            "--disable-setuid-sandbox",
            "--force-device-scale-factor",
            "--ignore-certificate-errors",
            "--no-sandbox",
        ],
        defaultViewport: { width: 1300, height: 1000 },
    },
    webVersionCache: {
        type: 'local'
    },
    authStrategy: new LocalAuth()
});

client.on('ready', () => {
    console.log('Client is ready!');
    console.log('running a task every minute');
    cron.schedule("30 4 * * *", async () => {
        try {
            const { previous, current: currentQuiz, pageIdToBeMoved } = await getQuizData()

            if (currentQuiz?.code) {
                // Generate Quiz image
                await generateCodeSnippet(currentQuiz.code);
            }

            if (previous) {
                const previousQuizMessageIds = await Promise.all(GROUP_IDs.map((id) => readFromRedis(id)))
                const previousDiscordQuizMessageId = await readFromRedis(DISCORD_CHANNEL_ID)

                const message = "The answer is \n" + previous.answer
                for (let index = 0; index < GROUP_IDs.length; index++) {
                    const gid = GROUP_IDs[index];
                    const messageId = previousQuizMessageIds[index]?.result

                    try {
                        await client.getMessageById(messageId)
                        await client.sendMessage(
                            gid,
                            message,
                            previousQuizMessageIds ? { quotedMessageId: previousQuizMessageIds[index]?.result } : undefined
                        );
                    } catch (err) {
                        await client.sendMessage(
                            gid,
                            message
                        )
                    }
                }

                if (previousDiscordQuizMessageId?.result) {
                    try {
                        await getDiscordMessageById(previousDiscordQuizMessageId?.result);
                        await sendAMessageToDiscord({
                            content: message,
                            message_reference: {
                                message_id: previousDiscordQuizMessageId?.result
                            }
                        })
                    } catch (err) {
                        await sendAMessageToDiscord({
                            content: message,
                        })
                    }
                } else {
                    await sendAMessageToDiscord({
                        content: message,
                    })
                }
            }

            if (currentQuiz?.code) {
                const media = MessageMedia.fromFilePath(imagePath)
                for (let index = 0; index < GROUP_IDs.length; index++) {
                    const gid = GROUP_IDs[index];
                    await client.sendMessage(gid, media, { caption: "Refer to this code." });
                }
                const formattedCode = `\`\`\`\n${currentQuiz?.code}\n\`\`\``
                await sendAMessageToDiscord({ content: formattedCode })
            }

            for (let index = 0; index < GROUP_IDs.length; index++) {
                const gid = GROUP_IDs[index];
                const message = await client.sendMessage(gid, new Poll(currentQuiz.question, currentQuiz.options, { allowMultipleAnswers: false }));
                await writeToRedis(gid, message.id._serialized)
            }

            const poll = await postPollToDiscord({
                question: currentQuiz.question,
                options: currentQuiz.options.map((a) => a.slice(3))
            })

            await sendAMessageToDiscord({
                content: "@everyone quiz of the day",
                message_reference: {
                    message_id: poll.data.id
                }
            })
            await writeToRedis(DISCORD_CHANNEL_ID, `${poll.data.id}`)
            await moveQuizStatusToDone(pageIdToBeMoved);
        } catch (err) {
            console.log(JSON.stringify(err, null, 2))
        }
        // client.getContacts().then((contacts) => {
        //     contacts.map((c) => {
        //         if(c.isGroup && c.name.includes("DuoLearn")) {
        //             console.log(c.id._serialized, c.name)
        //         }
        //     })
        // })
    })
});

client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
})

client.on('authenticated', () => {
    console.log('Client authenticated!');
});

client.on('disconnected', (reason) => {
    console.log('Client was logged out', reason);
});

// Start the client
client.initialize();

