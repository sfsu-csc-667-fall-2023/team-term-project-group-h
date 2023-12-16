const database = require("../connection");
const { connection: db } = database;

const ADD_PLAYER_POINTS = `
  UPDATE game_users
  SET hand_points=hand_points+$3
  WHERE game_id=$1 AND user_id=$2
`;

const addPlayerPoints = (gameId, userId, roundPoints) => db.none(ADD_PLAYER_POINTS, [gameId, userId, roundPoints]);

module.exports = { addPlayerPoints };