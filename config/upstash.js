const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } = require("./IDs")

const readFromRedis = async (key) => {
    const res = await fetch(`${UPSTASH_REDIS_REST_URL}/get/${key}`, {
        headers: {
            Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}`
        }
    })

    return res.json()
}

const writeToRedis = async (key, value) => {
    const res = await fetch(`${UPSTASH_REDIS_REST_URL}/set/${key}/${value}`, {
        headers: {
            Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}`
        }
    })

    return res.json()
}


module.exports = {
    readFromRedis,
    writeToRedis
}