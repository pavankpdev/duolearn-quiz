import dotenv from "dotenv";

dotenv.config();

const DISCORD_API_ORIGIN = "https://discord.com/api/v10";

const testGroupIds = ["120363177711526658@g.us", "120363020145538029@g.us"];
const devGroupIds = ["919686855796@c.us"];
const prodGroupIds = [
  "120363024352793011@g.us",
  "120363029131273696@g.us",
  "120363030881044093@g.us",
];

const {
  NOTION_QUIZ_DATABASE_ID,
  NOTION_SECRET,
  imagePath,
  UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN,
  QUIZ_COUNTER,
  DISCORD_TOKEN,
  DISCORD_CHANNEL_ID,
  MODE,
  AIRTABLE_API_KEY,
  AIRTABLE_API_BASE_URL,
  AIRTABLE_API_DATABASE_ID,
  AIRTABLE_API_DATABASE_TABLE,
  DATABASE_URL
} = process.env as {
  NOTION_QUIZ_DATABASE_ID: string;
  NOTION_SECRET: string;
  imagePath: string;
  UPSTASH_REDIS_REST_URL: string;
  UPSTASH_REDIS_REST_TOKEN: string;
  QUIZ_COUNTER: string;
  DISCORD_TOKEN: string;
  DISCORD_CHANNEL_ID: string;
  MODE: "dev" | "prod" | "test";
  AIRTABLE_API_KEY: string;
  AIRTABLE_API_BASE_URL: string;
  AIRTABLE_API_DATABASE_ID: string;
  AIRTABLE_API_DATABASE_TABLE: string;
  DATABASE_URL: string;
};

const GROUP_IDs =
  MODE === "dev" ? devGroupIds : MODE === "test" ? testGroupIds : prodGroupIds;

const EVERY_MINUTE = "* * * * *";
const EVERY_DAY_AT_10AM_IST = "30 4 * * *";

const DailyScheduleCronExpression =
  MODE === "dev" ? EVERY_MINUTE : EVERY_DAY_AT_10AM_IST;

export {
  GROUP_IDs,
  DISCORD_API_ORIGIN,
  NOTION_QUIZ_DATABASE_ID,
  NOTION_SECRET,
  imagePath,
  UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN,
  QUIZ_COUNTER,
  DISCORD_TOKEN,
  DISCORD_CHANNEL_ID,
  AIRTABLE_API_KEY,
  AIRTABLE_API_BASE_URL,
  AIRTABLE_API_DATABASE_ID,
  AIRTABLE_API_DATABASE_TABLE,
  DATABASE_URL,
  DailyScheduleCronExpression,
};
