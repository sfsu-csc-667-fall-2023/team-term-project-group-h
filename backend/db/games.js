const { create } = require("./games/create");
const { addUser } = require("./games/add-user");
const { getGame } = require("./games/get-game");
const { getAvailableGames } = require("./games/get-available-games");
const { userCount } = require("./games/user-count");
const { initialize } = require("./games/initialize");
const { usersInGame } = require("./games/users-in-game");

module.exports = {
  create,
  addUser,
  getGame,
  getAvailableGames,
  userCount,
  initialize,
  usersInGame
};
