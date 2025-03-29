import { pgPool } from "@config/pg";
import { waClient } from "@config/wa";
import { WhatsApp } from "@lib/whatsapp";

const whatsapp = new WhatsApp(waClient);

whatsapp.start();

process.on("SIGINT", async () => {
  pgPool.end(() => {
    console.log("PostgreSQL pool closed");
    process.exit(0);
  });
});
