const { map } = require("../../routes/games");
const database = require("../connection");
const { connection: db } = database;

const getMapCountPlayers = async () => {
  try {
    const mapCountPlayers = await db.any(`
    SELECT
        gu.game_id,
        g.title AS game_title,
        COUNT(gu.user_id) AS total_players
    FROM
        game_users gu
    JOIN
        games g ON gu.game_id = g.id
    GROUP BY
        gu.game_id, g.title;
        `);
    //  we need an object where the key is the game_id and the value is the total_players
    const results = {};
    mapCountPlayers.forEach((game) => {
        results[game.game_id] = game.total_players;
    });
    return results;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

module.exports = { getMapCountPlayers };
