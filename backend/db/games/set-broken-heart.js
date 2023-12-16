const database = require("../connection");
const { connection: db } = database;

const SET_BROKEN_HEART = `
  UPDATE games SET broken_hearts=$1
  WHERE id=$2
`;

const setBrokenHeart = (isBroken, gameId) => 
  db.none(SET_BROKEN_HEART, [isBroken, gameId]);

module.exports = { setBrokenHeart };