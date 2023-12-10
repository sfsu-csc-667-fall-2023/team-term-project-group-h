const database = require("../connection");
const { connection: db } = database;

const INIT_POINTS = `
  UPDATE game_users SET game_points=0, hand_points=0
  WHERE game_id=$1
`;

const initilizePoints = (gameId, userId) =>
  db
    .one(IS_CURRENT_PLAYER, [gameId])
    .then(({ turn_number: playerId }) => playerId === userId);

module.exports = { initilizePoints };