/* eslint-disable camelcase */

exports.shorthands = undefined;

/**
 *
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */
exports.up = (pgm) => {
  pgm.createTable("games", {
    /*
        table games {
  table games {
  id int PK // game_id
  // players_allowed int // not null
  password varchar(100)
  active bool
  turn_player_id int
  turn_number int // default 0
  suit_dominant suits
  player_dominant int // FK
  broken_hearts bool // hearts cannot be played first until someone breaks heart  
  created_at timestamp  // default now() not null
  updated_at timestamp  // not null
  started_at timestamp
}
}  
        */

    id: {
      type: "id",
      primaryKey: true,
      autoincrement: true,
    },
    game_socket_id: {
      type: "varchar",
      notNull: true,
    },
    password: {
      type: "varchar(100)",
    },
    active: {
      type: "bool",
    },
    turn_player_id: {
      type: "int",
    },
    turn_number: {
      type: "int",
      default: 0,
    },
    suit_dominant: {
      type: "card_suits",
    },
    player_dominant: {
      type: "int",
    },
    Number_dominant: {
      type: "card_numbers",
    },
    broken_hearts: {
      type: "bool",
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
