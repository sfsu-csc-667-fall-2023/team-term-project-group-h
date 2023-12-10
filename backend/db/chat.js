const database = require("./connection");
const { connection: db, pgp } = database;

const CHAT_EXISTS = "SELECT chat FROM chat_message WHERE game_id=$1";
const GET_MESSAGES = "SELECT * FROM chat_message WHERE game_id=$1";
const ADD_MESSAGE = `
  INSERT INTO chat_message (user_id, game_id, content, created_at)
  VALUES ($1, $2, $3, NOW())
  RETURNING *
`;
const CONVERT_USER_ID_TO_USERNAME = "SELECT username FROM users WHERE id=$1";

const chat_exists = (game_id) => {
  db.one(CHAT_EXISTS, [game_id])
    .then((_) => true)
    .catch((_) => false);
};

const get_messages = async (game_id) => {
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
    return processedResults;
  } catch (error) {
    console.error("Error:", error);
  }
};

const add_message = (user_id, game_id, content) => {
  return db.one(ADD_MESSAGE, [user_id, game_id, content]);
};

module.exports = {
  get_messages,
  chat_exists,
  add_message,
};
