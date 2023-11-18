/* eslint-disable camelcase */

exports.shorthands = undefined;


/**
 * 
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */
exports.up = pgm => {
    /*
    table chat_messages {
  user_id int // FK
  game_id int // FK game_id 0 if its global lobby
  content varchar
  created_at timestamp  // not null
}
    */
    pgm.createTable("chat_message", {
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
        content: {
            type: "varchar"
        },
        created_at: {
            type: "timestamp",
            notNull: true,
            default: pgm.func("current_timestamp")
        }
    });

};
/**
 * 
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */
exports.down = pgm => {
    pgm.dropTable("chat_message");
};
