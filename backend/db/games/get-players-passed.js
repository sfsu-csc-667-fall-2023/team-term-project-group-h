const database = require("../connection");
const { connection: db } = database;

const GET_USERS_PASSED = `
  SELECT COUNT(*) FROM game_users
  WHERE game_id=$1 AND passed=true
`;

const getPlayersPassed = (gameId) =>
  db.one(GET_USERS_PASSED, [gameId]).then(({ count }) => parseInt(count));

module.exports = { getPlayersPassed };