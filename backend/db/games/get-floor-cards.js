const database = require("../connection");
const { connection: db } = database;

const GET_FLOOR_CARDS = `
  SELECT * FROM game_cards
  WHERE game_id=$1 AND card_order=0
`;

const getFloorCards = (gameId) => db.any(GET_FLOOR_CARDS, [gameId]);

module.exports = { getFloorCards };