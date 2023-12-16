const database = require("../connection");
const { connection: db } = database;

const GET_TWOCLUBS_HOLDER = `
  SELECT user_id FROM game_cards
  WHERE card_id=15 AND game_id=$1
`;

const getTwoClubsHolder = (gameId) => db.one(GET_TWOCLUBS_HOLDER, [gameId]);

module.exports = { getTwoClubsHolder };