async function isInLimit(chat, id, limit = Infinity) {
    let result = (await chat.fetchMessages({ limit })).find((m) => m.id._serialized === id);
    return Boolean(result);
}

async function preloadMessages(chat, id) {
    // Gets the current loaded messages.
    const fetchAllMsgsInCache = async () => chat.fetchMessages({ limit: Infinity });

    // Is the message in cache?
    let inCache = await isInLimit(chat, id);
    // This number of extra messages to fetch every time.
    const increment = 50;
    // Number of current loaded messages
    let currentMsgsCount = (await fetchAllMsgsInCache()).length

    // The main loop that keeps fetching messages until the message has been found.
    while (inCache === false) {
        // Increase the current messages count by increment
        currentMsgsCount += increment;
        // Sets the inCache with the new limit. When this variable becomes true, the loop will stop.
        inCache = await isInLimit(chat, id, currentMsgsCount);
    }
    // Return the message found.
    return (await fetchAllMsgsInCache()).find(
        (m) => m.id._serialized === id
    );
}

module.exports = {
    preloadMessages
}