const database = require("../connection");
const { connection: db } = database;

const GET_DOMINANT_NUMBER = `
  SELECT number_dominant FROM games
  WHERE id=$1
`;

const getDominantNumber = (gameId) => db.one(GET_DOMINANT_NUMBER, [gameId])

module.exports = { getDominantNumber };