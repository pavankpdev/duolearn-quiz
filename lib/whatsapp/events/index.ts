import { Client } from "whatsapp-web.js";
import { onQR } from "./onQR";
import { onDisconnected } from "./onDisconnected";
import { onReady } from "./onReady";
import { onVote } from "./onVote";

export const registerEvents = (client: Client) => {
  client.on("qr", onQR);
  client.on("disconnected", onDisconnected);
  client.on("ready", onReady);
  client.on("vote_update", onVote);
};
