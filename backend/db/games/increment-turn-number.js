const database = require("../connection");
const { connection: db } = database;

const INCREMENT_TURN_NUMBER = `
  
UPDATE games
SET turn_number = turn_number + 1
WHERE id = $1;
`;

const incrementTurnNumber = (gameId) => db.one(INCREMENT_TURN_NUMBER, [gameId]);

module.exports = { incrementTurnNumber };