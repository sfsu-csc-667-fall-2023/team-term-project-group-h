/* eslint-disable camelcase */

exports.shorthands = undefined;


/**
 * 
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */
exports.up = pgm => {
    
        pgm.createTable("game_users", {
            /*
            table game_users {
  user_id int // not null fk
  game_id int // not null fk
  seat int 
  game_points int // the total points the player has in the match
  hand_points int // the amount of points the player gained in a single hand
  all_points bool // special case: one player earns all possible points(26) in a hand
}
    }  
            */
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
