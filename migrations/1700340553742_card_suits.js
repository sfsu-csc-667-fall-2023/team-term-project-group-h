/* eslint-disable camelcase */

exports.shorthands = undefined;

/**
 * 
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */
exports.up = pgm => {
  pgm.createType("card_suits", ["hearts", "diamonds", "spades", "clubs"]);
};
/**
 * 
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */
exports.down = pgm => {
  pgm.dropType("card_suits");
};
