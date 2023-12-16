const database = require("../connection");
const { connection: db } = database;

const GET_CARD_POINTS = `
  SELECT point FROM cards
  WHERE id=$1
`;

const getCardPoints = (cardId) => db.one(GET_CARD_POINTS, [cardId]).then((result) => result.point);

module.exports = { getCardPoints };