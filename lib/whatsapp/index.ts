import { Client } from "whatsapp-web.js";
import { pgClient } from "@config/pg";
import { registerEvents } from "./events";

export class WhatsApp {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async start() {
    try {
      await pgClient.connect();
      console.log("Postgres client connected!");

      registerEvents(this.client);

      this.client.initialize();
      console.log("WhatsApp client initialized!");
    } catch (error) {
      console.error("Error starting WhatsApp client:", error);
    }
  }

  getClient(): Client {
    return this.client;
  }
}
