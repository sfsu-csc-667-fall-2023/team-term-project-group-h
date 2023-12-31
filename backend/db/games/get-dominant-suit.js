const database = require("../connection");
const { connection: db } = database;

const SUIT_DOMINANT = `
  SELECT suit_dominant FROM games
  WHERE id=$1
`;

const getDominantSuit = (gameId) => db.one(SUIT_DOMINANT, [gameId]);

module.exports = { getDominantSuit };