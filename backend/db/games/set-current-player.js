const database = require("../connection");
const { connection: db } = database;

const SET_CURRENT_PLAYER = `
  UPDATE games SET turn_player_id=$1
  WHERE id=$2
  RETURNING turn_player_id
`;

const setCurrentPlayer = (playerId, gameId) =>
  db.one(SET_CURRENT_PLAYER, [playerId, gameId]);

module.exports = { setCurrentPlayer };