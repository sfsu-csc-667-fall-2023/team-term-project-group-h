const database = require("../connection");
const { connection: db } = database;

const PLAYER_DOMINANT = `
  SELECT player_dominant FROM games
  WHERE id=$1
`;

const getDominantPlayer = (gameId) => db.one(IS_CURRENT_PLAYER, [gameId])

module.exports = { getDominantPlayer };