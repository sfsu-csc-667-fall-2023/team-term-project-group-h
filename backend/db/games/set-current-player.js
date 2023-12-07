const database = require("../connection");
const { connection: db } = database;

const SET_CURRENT_PLAYER = `
  UPDATE games SET turn_number=$1
  WHERE id=$2
  RETURNING turn_number
`;

const setCurrentPlayer = (seatIndex, gameId) =>
  db.one(SET_CURRENT_PLAYER, [seatIndex, gameId]);

module.exports = { setCurrentPlayer };