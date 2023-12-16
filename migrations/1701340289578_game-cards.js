/* eslint-disable camelcase */

exports.shorthands = undefined;


/**
 * 
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */
exports.up = pgm => {        
  pgm.createTable("game_cards", {
    card_id: {
      type: "int",
      notNull: true,
      references: "cards(id)"
    },
    game_id: {
      type: "int",
      notNull: true,
      references: "games(id)"
    },
    user_id: {
      type: "int",
      notNull: true,
    },
    card_order: {
      type: "int"
    }
  });
};
/**
 * 
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */
exports.down = pgm => {
  pgm.dropTable("game_cards");
};
