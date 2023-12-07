const database = require("../connection");
const { connection: db } = database;

const GET_AVAILABLE_GAMES = `
    SELECT DISTINCT g.title, gu.game_id 
    FROM games g 
    LEFT JOIN game_users gu ON g.id = gu.game_id AND gu.user_id = $1
    WHERE gu.user_id IS NULL
`;

const getAvailableGames = (user_id) => db.any(GET_AVAILABLE_GAMES, [user_id]);

module.exports = { getAvailableGames };
