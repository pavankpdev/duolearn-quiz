import { Client, LocalAuth } from "whatsapp-web.js";

export const waClient = new Client({
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
    type: "local",
  },
  authStrategy: new LocalAuth(),
});
