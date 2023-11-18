/* eslint-disable camelcase */

exports.shorthands = undefined;


/**
 * 
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */
exports.up = pgm => {
    /*
    table cards {
  id int PK
  number enum // enum
  suit suits
  point int // not null, 1 for hearts, 13 for queen spade, 0 for rest
} 
    */

    pgm.createTable("cards", {
        id: {
            type: "id",
            primaryKey: true,
            autoincrement: true
        },
        number: {
            type: "card_numbers",
            notNull: true
        },
        suits: {
            type: "card_suits",
            notNull: true
        },
        point: {
                type: "int",
                notNull: true
            },
        value: {
            type: "int",
            notNull: true
        }

    });
};
/**
 * 
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */
exports.down = pgm => {
    pgm.dropTable("cards");
};
