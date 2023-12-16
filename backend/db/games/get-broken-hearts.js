const database = require("../connection");
const { connection: db } = database;

const GET_BROKEN_HEART = `
  SELECT broken_hearts FROM games
  WHERE id=$1
`;

const getBrokenHearts = (gameId) => db.one(GET_BROKEN_HEART, [gameId])

module.exports = { getBrokenHearts };