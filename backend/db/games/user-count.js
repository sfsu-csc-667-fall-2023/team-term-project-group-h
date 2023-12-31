const database = require("../connection");
const { connection: db } = database;

const GET_USER_COUNT = `
  SELECT COUNT(*) FROM game_users
  WHERE game_id=$1
`;

const userCount = (gameId) =>
  db.one(GET_USER_COUNT, [gameId]).then(({ count }) => parseInt(count));

module.exports = { userCount };