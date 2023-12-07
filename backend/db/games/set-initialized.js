const database = require("../connection");
const { connection: db } = database;

const SET_INITIALIZED = `
  UPDATE games SET active=true
  WHERE id=$1
`;

const setInitialized = (gameId) => db.none(SET_INITIALIZED, [gameId]);

module.exports = { setInitialized };