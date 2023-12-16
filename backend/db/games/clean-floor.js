const database = require("../connection");
const { connection: db } = database;

const CLEAN_FLOOR = `
  UPDATE game_cards
  SET card_order=-1
  WHERE game_id=$1 AND card_order=0
`;

const cleanFloor = (gameId) => db.none(CLEAN_FLOOR, [gameId]);

module.exports = { cleanFloor };