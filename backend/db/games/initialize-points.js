const database = require("../connection");
const { connection: db } = database;

const INIT_POINTS = `
  UPDATE game_users SET game_points=0, hand_points=0
  WHERE game_id=$1

`;

const initializePoints = (gameId) => db.none(INIT_POINTS, [gameId]);

module.exports = { initializePoints };