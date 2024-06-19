const { Client, Poll, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const { GROUP_IDs } = require('./config/IDs');
const { getQuizData } = require('./helpers/getQuizData');
const { generateCodeSnippet } = require('./helpers/generateCodeSnippet');
const qrcode = require("qrcode-terminal")


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
        process.exit(0);
    }

    client.on('ready', async () => {
        console.log('Client is ready!');

        const { previous, current: currentQuiz } = await getQuizData(0)

        if (currentQuiz.code) {
            // Generate Quiz image
            await generateCodeSnippet(currentQuiz.code);
        }

        if (previous) {
            await Promise.all(GROUP_IDs.map(gid => client.sendMessage(gid, previous.answer)))
        }

        if (currentQuiz.code) {
            const media = MessageMedia.fromFilePath("code-snippet.png")
            await Promise.all(GROUP_IDs.map(gid => client.sendMessage(gid, media, { caption: "Refer to this code." })))
        }

        await Promise.all(GROUP_IDs.map(gid => client.sendMessage(gid, new Poll(currentQuiz.question, currentQuiz.options, { allowMultipleAnswers: false }))))

        setTimeout(
            cleanup,
            3000
        )
    });

    client.on('authenticated', () => {
        console.log('Client authenticated!');
    });

    client.on('disconnected', (reason) => {
        console.log('Client was logged out', reason);
    });

    client.on("poll_vote", (reason) => {
        console.log('Voted', reason);
    });

    // Start the client
    client.initialize();


};

run()