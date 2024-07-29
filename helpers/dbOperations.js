const {pgClient} = require("../config/pg")

const saveAnswer = async (messageId, answer, groupId) => {
    const query = `INSERT INTO "answers" (message_id, answer, group_id) VALUES ($1, $2, $3)`;
    const values = [messageId, answer, groupId];

    return pgClient.query(query, values);
}

const incrementPointLeaderBoard = async (candidateId, groupId) => {
    try {
        await pgClient.query('BEGIN');

        const candidate = await pgClient.query(
            `SELECT points FROM "leaderboard" WHERE candidate_id = $1 AND group_id = $2`,
            [candidateId, groupId]
        );

        if (candidate.rows.length > 0) {
            await pgClient.query(
                `UPDATE "leaderboard" SET points = points + 1 WHERE candidate_id = $1 AND group_id = $2`,
                [candidateId, groupId]
            );
        } else {
            await pgClient.query(
                `INSERT INTO "leaderboard" (candidate_id, group_id, points) VALUES ($1, $2, 1)`,
                [candidateId, groupId]
            );
        }

        await pgClient.query('COMMIT');
    } catch (err) {
        await pgClient.query('ROLLBACK');
        throw err
    }
}

const decrementPointLeaderBoard = async (candidateId, groupId) => {
    try {
        await pgClient.query('BEGIN');

        const candidate = await pgClient.query(
            `SELECT points FROM "leaderboard" WHERE candidate_id = $1 AND group_id = $2`,
            [candidateId, groupId]
        );

        if (candidate.rows.length > 0) {
            const currentPoints = candidate.rows[0].points;
            if (currentPoints > 0) {
                await pgClient.query(
                    `UPDATE "leaderboard" SET points = points - 1 WHERE candidate_id = $1 AND group_id = $2`,
                    [candidateId, groupId]
                );
            }
        }
        await pgClient.query('COMMIT');
    } catch (err) {
        await pgClient.query('ROLLBACK');
        throw err;
    }
}

const saveVoteHistory = async (
    messageId, voterId, option, groupId, isPassed
) => {
    const query = `
    INSERT INTO "vote_history" (message_id, voter_id, option, group_id, is_passed)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
    const values = [messageId, voterId, option, groupId, isPassed];

    return pgClient.query(query, values);
}

const getCurrentLeaderBoard = async (groupId) => {
    const query = `
    SELECT candidate_id, points
    FROM "leaderboard"
    WHERE group_id = $1
    ORDER BY points DESC
    LIMIT 5;
  `;

   const values = [groupId]
   return pgClient.query(query, values);

}

const getAnswerByMessageId = async (messageId) => {
    const query = `SELECT * FROM "answers" WHERE message_id = $1`
    const values = [messageId]

    return pgClient.query(query, values)
}

const getVoteHistory = async (
    messageId,
    voter_id
) => {
    const query = `SELECT * FROM "vote_history" WHERE message_id = $1 AND voter_id = $2`
    const values = [messageId, voter_id]

    return pgClient.query(query, values)
}

const removeVoteHistory = async (
    messageId,
    voter_id
) => {
    const query = `DELETE FROM "vote_history" WHERE message_id = $1 AND voter_id = $2`
    const values = [messageId, voter_id]

    return pgClient.query(query, values)
}

module.exports = {
    saveAnswer,
    incrementPointLeaderBoard,
    saveVoteHistory,
    getCurrentLeaderBoard,
    getAnswerByMessageId,
    getVoteHistory,
    removeVoteHistory,
    decrementPointLeaderBoard
}