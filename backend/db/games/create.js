const database = require("../connection");
const { connection: db } = database;

const CREATE = "INSERT INTO games (game_socket_id, title) VALUES ($1, $2) RETURNING id";

const create = (gameSocketId, title) => db.one(CREATE, [gameSocketId, title]);

module.exports = { create };