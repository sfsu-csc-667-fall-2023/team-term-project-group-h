const database = require("../connection");
const { connection: db } = database;

const GET_SUIT = `
  SELECT suits FROM cards
  WHERE id=$1
`;

const getCardSuit = (cardId) => db.one(GET_SUIT, [cardId]);

module.exports = { getCardSuit };