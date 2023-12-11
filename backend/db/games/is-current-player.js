const database = require("../connection");
const { connection: db } = database;

const IS_CURRENT_PLAYER = `
  SELECT turn_player_id FROM games
  WHERE id=$1
`;

const isCurrentPlayer = (gameId, userId) =>
  db
    .one(IS_CURRENT_PLAYER, [gameId])
    .then(({ turn_number: playerId }) => playerId === userId);

module.exports = { isCurrentPlayer };