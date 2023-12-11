const database = require("../connection");
const { connection: db } = database;

const SET_PASSED = `
  UPDATE game_users SET passed=true
  WHERE user_id=$1 AND game_id=$2
`;

const setPassed = (userId, gameId) => db.none(SET_PASSED, [userId, gameId]);

module.exports = { setPassed };