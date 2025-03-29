import { Client } from "whatsapp-web.js";
import { pgClient, pgPool } from "@config/pg";
import { registerEvents } from "./events";

export class WhatsApp {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async start() {
    try {
      registerEvents(this.client);

      this.client.initialize();
      console.log("WhatsApp client initialized!");

      pgPool.on("error", (err) => {
        console.error("Unexpected error on idle client", err);
        process.exit(-1);
      });
    } catch (error) {
      console.error("Error starting WhatsApp client:", error);
    }
  }

  getClient(): Client {
    return this.client;
  }
}
