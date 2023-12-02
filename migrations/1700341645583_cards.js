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
        suits: {
            type: "int",
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

    const sql = "INSERT INTO cards (suits, point, value) VALUES";
    const values = [];

    for (let suit = 0; suit < 4; suit++) {
      for (let value = 1; value <= 13; value++) {
        if(suit == 3) {
            values.push(`(${suit}, ${1}, ${value})`);
        } else if(suit == 0 && value == 12) {
            values.push(`(${suit}, ${13}, ${value})`);
        } else {
            values.push(`(${suit}, ${0}, ${value})`);
        }
      }
    }

  const query = `${sql} ${values.join(",")}`;

  pgm.sql(query);
};
/**
 * 
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */
exports.down = pgm => {
    pgm.dropTable("cards");
};
