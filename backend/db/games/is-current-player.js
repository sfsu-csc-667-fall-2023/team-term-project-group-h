const database = require("../connection");
const { connection: db } = database;

const IS_CURRENT_PLAYER = `
SELECT EXISTS (
  SELECT 1
  FROM games
  WHERE id = $1 AND turn_player_id = $2
) AS is_current_player;
`;

const isCurrentPlayer = (gameId, userId) =>
  db
    .one(IS_CURRENT_PLAYER, [gameId, userId])
    .then((result) => result.is_current_player);

module.exports = { isCurrentPlayer };
