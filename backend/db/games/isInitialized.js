const database = require("../connection");
const { connection: db } = database;

const IS_INITIALIZED = `
  SELECT active FROM games
  WHERE id=$1
`;

const isInitialized = (gameId) => db.one(IS_INITIALIZED, [gameId]);

module.exports = { isInitialized };