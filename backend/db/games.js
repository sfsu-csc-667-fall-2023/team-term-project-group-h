const db = require("./connection");

const CREATE = "INSERT INTO games (game_socket_id, title) VALUES ($1, $2) RETURNING id";
const ADD_USER = "INSERT INTO game_users (user_id, game_id) VALUES ($1, $2)";
const GET_GAME = "SELECT * FROM games WHERE id=$1";
const GET_AVAILABLE_GAMES = "SELECT * FROM games";
const GET_USER_COUNT = "SELECT COUNT(*) FROM game_users WHERE game_id=$1";
const GET_USER_COUNT_ALL = "SELECT COUNT(*) FROM game_users";

const create = (gameSocketId, title) => db.one(CREATE, [gameSocketId, title]);

const addUser = (userId, gameId) => db.none(ADD_USER, [userId, gameId]);

const getGame = (gameId) => db.one(GET_GAME, gameId);

const getAvailableGames = () => db.any(GET_AVAILABLE_GAMES);

const userCount = (gameId) => db.one(GET_USER_COUNT, [gameId])
  .then(({ count }) => parseInt(count));

const userCountAll = () => db.any(GET_USER_COUNT_ALL);

module.exports = {
  create,
  addUser,
  getGame,
  getAvailableGames,
  userCount,
  userCountAll
};
