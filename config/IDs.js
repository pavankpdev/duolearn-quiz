const GROUP_IDs = [
    "919686855796@c.us",
]

const DISCORD_API_ORIGIN = "https://discord.com/api/v10"

const {
    NOTION_QUIZ_DATABASE_ID,
    NOTION_SECRET,
    imagePath,
    UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN,
    QUIZ_COUNTER,
    DISCORD_TOKEN
} = process.env;

module.exports = {
    GROUP_IDs,
    DISCORD_API_ORIGIN,
    NOTION_QUIZ_DATABASE_ID,
    NOTION_SECRET,
    imagePath,
    UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN,
    QUIZ_COUNTER,
    DISCORD_TOKEN
}