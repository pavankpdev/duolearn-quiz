require("dotenv").config()
const { Client, Poll, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const { GROUP_IDs, imagePath } = require('./config/IDs');
const { getQuizData } = require('./helpers/getQuizData');
const { generateCodeSnippet } = require('./helpers/generateCodeSnippet');
const { writeToRedis, readFromRedis } = require("./config/upstash");
const cron = require('node-cron');
const qrcode = require('qrcode-terminal');
const { moveQuizStatusToDone } = require('./helpers/updateQuizStatus');

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
            const message = "The answer is \n" + previous.answer
            await Promise.all(
                GROUP_IDs.map((gid, index) => client.sendMessage(
                    gid,
                    message,
                    previousQuizMessageIds ? { quotedMessageId: previousQuizMessageIds[index]?.result } : undefined
                )
                )
            )
        }

        if (currentQuiz?.code) {
            const media = MessageMedia.fromFilePath(imagePath)
            await Promise.all(GROUP_IDs.map((gid) => client.sendMessage(gid, media, { caption: "Refer to this code." })))
        }
        const results = await Promise.all(GROUP_IDs.map((gid) => client.sendMessage(gid, new Poll(currentQuiz.question, currentQuiz.options, { allowMultipleAnswers: false }))))

        await Promise.all(
            results.map((c, index) => writeToRedis(GROUP_IDs[index], c.id._serialized))
        )
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