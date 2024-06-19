const { Client, Poll, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const { GROUP_IDs, imagePath } = require('./config/IDs');
const { getQuizData } = require('./helpers/getQuizData');
const { generateCodeSnippet } = require('./helpers/generateCodeSnippet');
const { sleep } = require("./helpers/sleep")
const fs = require('fs');
const { sendMessage, sendBulkMessages } = require('./helpers/messageSender');

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

        const { previous, current: currentQuiz } = await getQuizData(1)

        if (currentQuiz.code) {
            // Generate Quiz image
            await generateCodeSnippet(currentQuiz.code);
        }

        if (previous) {
            // TODO: send the previous answer as Quoted message using `quotedMessageId`, to do this, we need to store the message id, along with their associated group id
            const previousQuizMessageId = ""
            const result = await sendBulkMessages(client, "The answer is \n" + previous.answer, { quotedMessageId: previousQuizMessageId }, "TEXT")
            console.log("Prev");
            result.map((c) => console.log(c.id._serialized))
        }

        if (currentQuiz.code) {
            const media = MessageMedia.fromFilePath(imagePath)
            const result = await sendBulkMessages(client, media, { caption: "Refer to this code." }, "IMAGE")
            console.log("Code");
            result.map((c) => console.log(c.id._serialized))
        }

        const result = await sendBulkMessages(client, new Poll(currentQuiz.question, currentQuiz.options, { allowMultipleAnswers: false }), "QUIZ")
        console.log("Quiz");
        result.map((c) => console.log(c.id._serialized))

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