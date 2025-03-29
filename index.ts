import { waClient } from "@config/wa";
import { WhatsApp } from "@lib/whatsapp";

const whatsapp = new WhatsApp(waClient);

whatsapp.start();
