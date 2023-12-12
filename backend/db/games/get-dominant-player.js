const database = require("../connection");
const { connection: db } = database;

const PLAYER_DOMINANT = `
  SELECT player_dominant FROM games
  WHERE id=$1
`;

const getDominantPlayer = (gameId) => db.one(PLAYER_DOMINANT, [gameId])

module.exports = { getDominantPlayer };