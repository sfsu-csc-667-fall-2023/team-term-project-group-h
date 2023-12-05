/* eslint-disable camelcase */

exports.shorthands = undefined;

/**
 * 
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */
exports.up = pgm => {

    pgm.createTable("users", {
        /*
        table users {
  id int PK
  username varchar(255) unique // not null
  password varchar(255) // not null
  email varchar(254) unique // not null
  profile_image varchar(255)
  created_at timestamp  // not null  
  updated_at timestamp  // not null
}  
        */
        id: {
            type: "id",
            primaryKey: true,
            autoincrement: true
        },
        username: {
            type: "varchar(255)",
            notNull: true,
            unique: true
        },
        password: {
            type: "varchar(100)",
            notNull: true
        },
        email: {
            type: "varchar(254)",
            notNull: true,
            unique: true
        },
        profile_image: {
            type: "varchar(255)"
        },
        created_at: {
            type: "timestamp",
            notNull: true,
            default: pgm.func("current_timestamp")
        },
        updated_at: {
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
    pgm.dropTable("users");
};
