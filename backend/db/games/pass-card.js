const database = require("../connection");
const { connection: db } = database;

const PASS_CARD = `
  UPDATE game_cards SET user_id=$2
  WHERE card_id=$1 AND game_id=$3
`;

const passCard = (cardId, userId, gameId) => db.none(PASS_CARD, [cardId, userId, gameId])

module.exports = { passCard };