/* eslint-disable camelcase */

exports.shorthands = undefined;


/**
 * 
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */
exports.up = pgm => {
  pgm.createTable("game_users", {
    user_id: {
      type: "int",
      notNull: true,
      references: "users(id)"
    },
    game_id: {
      type: "int",
      notNull: true,
      references: "games(id)"
    },
    seat: {
      type: "int"
    },
    game_points: {
      type: "int"
    },
    hand_points: {
      type: "int"
    },
    all_points: {
      type: "bool"
    },
    is_ready: {
      type: "boolean",
      default: "false"
    },
    passed: {
      type: "boolean",
      default: "false"
    }
  });
};
/**
 * 
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */
exports.down = pgm => {
    pgm.dropTable("game_users");
};
