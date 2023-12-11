const database = require("../connection");
const { connection: db } = database;

const GET_CURRENT_TURN = `
  SELECT turn_number FROM games
  WHERE id=$1
`;

const getCurrentTurn = (gameId) => db.one(GET_CURRENT_TURN, [gameId]);

module.exports = { getCurrentTurn };