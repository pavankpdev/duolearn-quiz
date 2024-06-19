const { QUIZ_COUNTER } = require("../config/IDs")
const { readFromRedis, incrValueInRedis, writeToRedis } = require("../config/upstash")

const getCurrentQuizCounter = async () => {
    return readFromRedis(QUIZ_COUNTER)
}

const incrementQuizCounter = async () => {
    return incrValueInRedis(QUIZ_COUNTER)
}

const updateMessageId = async (groupId, messageId) => {
    return writeToRedis(groupId, messageId)
}

const getMessageId = async (groupId) => {
    return readFromRedis(groupId)
}

module.exports = {
    getCurrentQuizCounter,
    incrementQuizCounter,
    updateMessageId,
    getMessageId
}