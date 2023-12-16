const database = require("../connection");
const { connection: db } = database;

const GET_WINNER = `
  SELECT user_id FROM game_users
  WHERE game_id=$1 AND hand_points=(SELECT MIN(hand_points) FROM game_users WHERE game_id=$1)
`;

const getWinner = (gameId) => db.any(GET_WINNER, [gameId])

module.exports = { getWinner };