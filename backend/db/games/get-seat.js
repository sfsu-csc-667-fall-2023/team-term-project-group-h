const database = require("../connection");
const { connection: db } = database;

const GET_SEAT = `
  SELECT seat FROM game_users
  WHERE user_id=$1 AND game_id=$2
`;

const getSeat = (userId, gameId) => db.one(GET_SEAT, [userId, gameId]).then((data) => data.seat);

module.exports = { getSeat };