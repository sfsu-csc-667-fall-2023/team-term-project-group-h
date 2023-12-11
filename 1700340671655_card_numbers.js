/* eslint-disable camelcase */

exports.shorthands = undefined;

/**
 * 
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */
exports.up = pgm => {
    /*
    enum card-numbers {
  ace
  two
  three
  four
  five
  six
  seven
  eight
  nine
  ten
  jack
  queen
  king
}
    */
   pgm.createType("card_numbers", ["ace", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "jack", "queen", "king"]
   );

};
/**
 * 
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */
exports.down = pgm => {
    pgm.dropType("card_numbers");
};
