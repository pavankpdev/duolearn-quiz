const puppeteer = require('puppeteer');
const hljs = require('highlight.js');
const { imagePath } = require('../config/IDs');

const generateCodeSnippet = async (codeSnippet, language = "bash") => {
    const highlightedCode = hljs.highlight(codeSnippet, { language }).value;

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Code Snippet</title>
        <style>
            body {
                background-color: #282c34;
                color: #ffffff;
                font-family: 'Fira Code', monospace;
                padding: 20px;
            }
            pre {
                font-size: 16px;
                line-height: 1.5;
            }
        </style>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.0/styles/github-dark.min.css">
    </head>
    <body>
        <pre><code>${highlightedCode}</code></pre>
    </body>
    </html>`;

    const browser = await puppeteer.launch({
        headless: true,
        args: [
            "--disable-notifications",
            "--disable-setuid-sandbox",
            "--ignore-certificate-errors",
            "--no-sandbox",
        ]
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const content = await page.$('body');
    const boundingBox = await content.boundingBox();
    await page.setViewport({
        width: Math.ceil(boundingBox.width),
        height: Math.ceil(boundingBox.height)
    });

    await page.screenshot({ path: imagePath });
    await browser.close();

    return true;
}

module.exports = {
    generateCodeSnippet
}