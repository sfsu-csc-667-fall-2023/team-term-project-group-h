const database = require("../connection");
const { connection: db } = database;

const SET_SUIT_DOMINANT = `
  UPDATE games SET suit_dominant=$1
  WHERE id=$2
  RETURNING suit_dominant
`;

const setSuitDominant = (gameId) =>
  db.one(SET_SUIT_DOMINANT, [suit, gameId]);

module.exports = { setSuitDominant };