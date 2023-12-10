const { game } = require("../../routes");
const database = require("../connection");
const { connection: db } = database;

const GET_MESSAGES = "SELECT * FROM chat_message WHERE game_id=$1";
const CONVERT_USER_ID_TO_USERNAME = "SELECT username FROM users WHERE id=$1";

const getMessages = async (game_id) => {
  try {
    const results = await db.any(GET_MESSAGES, [game_id]);
    // substitute user_id for username
    const processedResults = await Promise.all(
      
      results.map(async (result) => {
        const date = new Date(result.created_at);
        return {
          username: await db.one(CONVERT_USER_ID_TO_USERNAME, [result.user_id]),
          content: result.content,
          created_at: date.toLocaleTimeString([], { hour12: false }),
        };
      })
    );
    console.log("processedResults:", processedResults);
    return processedResults;
  } catch (error) {
    console.error("Error:", error);
  }
};

module.exports = { getMessages };
