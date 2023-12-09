const { game } = require("../../routes");
const database = require("../connection");
const { connection: db } = database;
const { get_messages } = require("../chat");

const getMessages = async (game_id) => {
  try {
    const messages = await get_messages(game_id);
    return messages;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

module.exports = { getMessages };
