const database = require("../connection");
const { connection: db } = database;

const GET_NUMBER = `
  SELECT value FROM cards
  WHERE id=$1
`;

const getCardNumber = (cardId) => db.one(GET_NUMBER, [cardId]);

module.exports = { getCardNumber };