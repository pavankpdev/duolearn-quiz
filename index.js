const { Client, Poll, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const { GROUP_IDs, imagePath } = require('./config/IDs');
const { getQuizData } = require('./helpers/getQuizData');
const { generateCodeSnippet } = require('./helpers/generateCodeSnippet');
const { sleep } = require("./helpers/sleep")
const fs = require('fs');
const { sendMessage, sendBulkMessages } = require('./helpers/messageSender');
const {writeToRedis, readFromRedis} = require("./config/upstash");
const {incrementQuizCounter, getCurrentQuizCounter} = require("./helpers/persistentStore");

const run = async (event) => {
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
            headless: true,
        },
        webVersion: '2.2412.54v2',
        webVersionCache: {
            type: 'remote',
            remotePath: 'https://raw.githubusercontent.com/guigo613/alternative-wa-version/main/html/2.2412.54v2.html'
        },

        authStrategy: new LocalAuth()
    });

    const cleanup = async () => {
        await client.destroy();
        fs.unlinkSync(imagePath);  // Delete the file
        process.exit(0);
    }

    client.on('ready', async () => {
        console.log('Client is ready!');
        const cursor = await getCurrentQuizCounter()
        const { previous, current: currentQuiz } = await getQuizData(Number(cursor.result))

        if (currentQuiz.code) {
            // Generate Quiz image
            await generateCodeSnippet(currentQuiz.code);
        }

        if (previous) {
            const previousQuizMessageIds = await Promise.all(GROUP_IDs.map((id) => readFromRedis(id)))
            const message = "The answer is \n" + previous.answer
            await Promise.all(
                GROUP_IDs.map((gid, index) => {
                        console.log(`[PREVIOUS_ANSWER] ${gid} | ${message}`)
                        return client.sendMessage(
                            gid,
                            message,
                            { quotedMessageId: previousQuizMessageIds[index]?.result }
                        )
                    }
                )
            )
        }

        if (currentQuiz.code) {
            const media = MessageMedia.fromFilePath(imagePath)
            await sendBulkMessages(client, media, { caption: "Refer to this code." }, "IMAGE")
        }

        const result = await sendBulkMessages(client, new Poll(currentQuiz.question, currentQuiz.options, { allowMultipleAnswers: false }), null, "QUIZ")
        await Promise.all(
            result.map((c, index) => writeToRedis(GROUP_IDs[index], c.id._serialized))
        )
        await incrementQuizCounter()
        await sleep()

        setTimeout(() => cleanup(), 3000)
    });

    client.on('authenticated', () => {
        console.log('Client authenticated!');
    });

    client.on('disconnected', (reason) => {
        console.log('Client was logged out', reason);
    });

    // Start the client
    client.initialize();

};

run()