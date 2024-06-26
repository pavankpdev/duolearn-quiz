const axios = require("axios")
const { DISCORD_API_ORIGIN, DISCORD_TOKEN } = require("../config/IDs")

const get24HoursExpiryTimestamp = (hours = 24) => {
    const now = new Date();
    const expiryDate = new Date(now.getTime() + hours * 60 * 60 * 1000); // hours * 60 minutes * 60 seconds * 1000 milliseconds
    return expiryDate.toISOString();
}

const sendAMessageToDiscord = async (options) => {
    const url = `${DISCORD_API_ORIGIN}/channels/936995526115733524/messages`
    return axios({
        method: "POST",
        url,
        data: options,
        headers: {
            Authorization: `Bot ${DISCORD_TOKEN}`,
            'Content-Type': 'application/json; charset=UTF-8',
        }
    })
}

const postPollToDiscord = async (pollObject) => {
    return sendAMessageToDiscord({
        poll: {
            question: {
                text: pollObject?.question
            },
            answers: pollObject?.options.map((option, index) => ({
                answer_id: index + 1,
                poll_media: {
                    text: option
                }
            })),
            expiry: get24HoursExpiryTimestamp(),
            allow_multiselect: false,
            layout_type: 1
        }
    })
}

module.exports = {
    postPollToDiscord,
    sendAMessageToDiscord
}