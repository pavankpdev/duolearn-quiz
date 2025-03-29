const { GROUP_IDs } = require("../config/constants");

const sendBulkMessages = async (client, message, options = {}, type) => {
  return Promise.all(
    GROUP_IDs.map((gid) => {
      console.log(`[${type}] ${gid} | ${message}`);
      return client.sendMessage(gid, message, options);
    })
  );
};

module.exports = { sendBulkMessages };
