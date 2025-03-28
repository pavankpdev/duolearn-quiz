import { Client } from "whatsapp-web.js";
import { onQR } from "./onQR";
import { onDisconnected } from "./onDisconnected";
import { onReady } from "./onReady";

export const registerEvents = (client: Client) => {
  client.on("qr", onQR);
  client.on("disconnected", onDisconnected);
  client.on("ready", onReady);
};
