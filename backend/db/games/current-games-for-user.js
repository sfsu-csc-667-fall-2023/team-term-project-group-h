const database = require("../connection");
const { connection: db } = database;

const CURRENT_GAMES = "SELECT distinct g.title, gu.game_id, g.created_at, g.active  FROM games g INNER JOIN game_users gu ON g.id = gu.game_id WHERE gu.user_id = $1";

const currentGamesForUser  = (user_id) => db.any(CURRENT_GAMES, [user_id]);

module.exports = { currentGamesForUser };