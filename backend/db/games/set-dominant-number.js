const database = require("../connection");
const { connection: db } = database;

const SET_NUMBER_DOMINANT = `
  UPDATE games SET number_dominant=$1
  WHERE id=$2
  RETURNING number_dominant
`;

const setDominantNumber = (number, gameId) =>
  db.one(SET_NUMBER_DOMINANT, [number, gameId]);

module.exports = { setDominantNumber };