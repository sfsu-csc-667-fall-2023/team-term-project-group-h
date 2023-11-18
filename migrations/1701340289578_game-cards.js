/* eslint-disable camelcase */

exports.shorthands = undefined;


/**
 * 
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */
exports.up = pgm => {
        
            pgm.createTable("game_cards", {
                /*
               
table game_cards {
  card_id int // fk
  game_id int // fk
  user_id int // fk, -1 if discarded
  card_order int // shuffled order of card in hand, 0 if on table, -1 if discarded, -2 for point cards
}
        }  
                */
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
                    references: "users(id)"
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
