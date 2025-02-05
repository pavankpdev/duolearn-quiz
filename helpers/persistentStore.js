const { readFromRedis, writeToRedis } = require("../config/upstash");

const updateMessageId = async (groupId, messageId) => {
  return writeToRedis(groupId, messageId);
};

const getMessageId = async (groupId) => {
  return readFromRedis(groupId);
};

module.exports = {
  updateMessageId,
  getMessageId,
};
