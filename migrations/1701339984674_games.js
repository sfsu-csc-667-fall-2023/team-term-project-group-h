/* eslint-disable camelcase */

exports.shorthands = undefined;

/**
 *
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */
exports.up = (pgm) => {
  pgm.createTable("games", {
    id: {
      type: "id",
      primaryKey: true,
      autoincrement: true,
    },
    game_socket_id: {
      type: "varchar",
      notNull: true,
    },
    title: {
      type: "varchar(100)",
      notNull: true,
    },
    active: {
      type: "bool",
      default: "false"
    },
    turn_player_id: {
      type: "int",
    },
    turn_number: {
      type: "int",
      default: 0,
    },
    suit_dominant: {
      type: "int",
    },
    player_dominant: {
      type: "int",
    },
    number_dominant: {
      type: "int",
    },
    broken_hearts: {
      type: "bool",
      default: "false"
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    updated_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    started_at: {
      type: "timestamp",
    },
  });
};
/**
 *
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */
exports.down = (pgm) => {
  pgm.dropTable("games");
};
