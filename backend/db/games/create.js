const database = require("../connection");
const { connection: db } = database;

const CREATE = "INSERT INTO games (game_socket_id, title, broken_hearts, turn_number) VALUES ($1, $2, false, 0) RETURNING id";

const create = (gameSocketId, title) => db.one(CREATE, [gameSocketId, title]);

module.exports = { create };