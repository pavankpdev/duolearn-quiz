require("dotenv").config()
const { Client, Poll, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const { GROUP_IDs, imagePath, DISCORD_CHANNEL_ID} = require('./config/IDs');
const { getQuizData } = require('./helpers/getQuizData');
const { generateCodeSnippet } = require('./helpers/generateCodeSnippet');
const { writeToRedis, readFromRedis } = require("./config/upstash");
const cron = require('node-cron');
const qrcode = require('qrcode-terminal');
const { moveQuizStatusToDone } = require('./helpers/updateQuizStatus');
const { sendAMessageToDiscord, postPollToDiscord } = require("./helpers/discord");

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
    webVersion: '2.2412.54v2',
    webVersionCache: {
        type: 'remote',
        remotePath: 'https://raw.githubusercontent.com/guigo613/alternative-wa-version/main/html/2.2412.54v2.html'
    },

    authStrategy: new LocalAuth()
});

client.on('ready', () => {
    console.log('Client is ready!');
    cron.schedule('* * * * *', async () => {
        console.log('running a task every minute');
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
                await client.sendMessage(
                    gid,
                    message,
                    previousQuizMessageIds ? { quotedMessageId: previousQuizMessageIds[index]?.result } : undefined
                );

                await sendAMessageToDiscord({
                    content: message,
                    message_reference: {
                        message_id: previousDiscordQuizMessageId ?? '1255556687268413563'
                    }
                })
            }
        }

        if (currentQuiz?.code) {
            const media = MessageMedia.fromFilePath(imagePath)
            for (let index = 0; index < GROUP_IDs.length; index++) {
                const gid = GROUP_IDs[index];
                await client.sendMessage(gid, media, { caption: "Refer to this code." });
                const formattedCode = `
                    \`\`\`
                    ${currentQuiz?.code}
                    \`\`\`
                `
                await sendAMessageToDiscord({content: formattedCode})
            }
        }

        for (let index = 0; index < GROUP_IDs.length; index++) {
            const gid = GROUP_IDs[index];
            const message = await client.sendMessage(gid, new Poll(currentQuiz.question, currentQuiz.options, { allowMultipleAnswers: false }));
            const poll = await postPollToDiscord({
                question: currentQuiz.question,
                options: currentQuiz.options
            })

            await sendAMessageToDiscord({
                content: "@everyone quiz of the day",
                message_reference: {
                    message_id: poll.data.id
                }
            })

            await writeToRedis(gid, message.id._serialized)
            await writeToRedis(DISCORD_CHANNEL_ID, poll.data.id)
        }

        await moveQuizStatusToDone(pageIdToBeMoved);
    });
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


// const ff = async () => {
//     const poll = await postPollToDiscord({
//         question: "currentQuiz.question",
//         options: ["currentQuiz.options", "qeqeq"]
//     })
//
//     await sendAMessageToDiscord({
//         content: "@everyone This is the quiz yoooooo",
//         message_reference: {
//             message_id: poll.data.id
//         }
//     })
// }
//
// ff()