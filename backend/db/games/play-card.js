const database = require("../connection");
const { connection: db } = database;

const PLAY_CARD = `
  UPDATE game_cards SET card_order=0
  WHERE card_id=$2 AND game_id=$1
  RETURNING card_order
`;

const playCard = (gameId, card_id) =>
  db.one(PLAY_CARD, [gameId, card_id]);

module.exports = { playCard };