const database = require("../connection");
const { connection: db } = database;

const GET_PLAYER_HAND = `
  SELECT * FROM game_cards
  WHERE game_id=$1 AND user_id=$2
`;

const getPlayerHand = (gameId, userId) => db.any(GET_PLAYER_HAND, [gameId, userId]);

module.exports = { getPlayerHand };