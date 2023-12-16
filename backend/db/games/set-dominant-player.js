const database = require("../connection");
const { connection: db } = database;

const SET_PLAYER_DOMINANT = `
  UPDATE games SET player_dominant=$1
  WHERE id=$2
  RETURNING player_dominant
`;

const setDominantPlayer = (userId, gameId) =>
  db.one(SET_PLAYER_DOMINANT, [userId, gameId]);

module.exports = { setDominantPlayer };