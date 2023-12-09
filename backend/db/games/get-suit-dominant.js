const database = require("../connection");
const { connection: db } = database;

const SUIT_DOMINANT = `
  SELECT suit_dominant FROM games
  WHERE id=$1
`;

const getSuitDominant = (gameId) => db.one(IS_CURRENT_PLAYER, [gameId])

module.exports = { getSuitDominant };