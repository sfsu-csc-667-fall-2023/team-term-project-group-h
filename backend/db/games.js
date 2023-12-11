const { create } = require("./games/create");
const { addUser } = require("./games/add-user");
const { getGame } = require("./games/get-game");
const { getAvailableGames} = require("./games/get-available-games");
const { currentGamesForUser } = require("./games/current-games-for-user");
const { userCount } = require("./games/user-count");
const { initialize } = require("./games/initialize");
const { usersInGame } = require("./games/users-in-game");
const { isInitialized } = require("./games/isInitialized");
const { readyPlayer } = require("./games/ready-player");
const { getState } = require("./games/get-state");
const { getCards } = require("./games/get-cards");
const { getCurrentPlayer } = require("./games/get-current-player");
const { setInitialized } = require("./games/set-initialized");
const { isPlayerInGame } = require("./games/is-player-in-game");
const { getSuitDominant } = require("./games/get-suit-dominant");
const { getMessages } = require("./games/get-messages");
const { getMapCountPlayers } = require("./games/get-map-count-players");
const { isCurrentPlayer } = require("./games/is-current-player");
const { initializePoints } = require("./games/initialize-points");
const { getSeat } = require("./games/get-seat");
const { passCard } = require("./games/pass-card");
const { getTwoClubsHolder } = require("./games/get-twoclubs-holder");
const { getCurrentTurn } = require("./games/get-current-turn");
const { setPassed } = require("./games/set-passed");
const { getPlayersPassed } = require("./games/get-players-passed");
const { incrementTurnNumber } = require("./games/increment-turn-number");

module.exports = {
  create,
  addUser,
  getGame,
  getAvailableGames,
  currentGamesForUser,
  userCount,
  initialize,
  usersInGame,
  isInitialized,
  readyPlayer,
  getState,
  getCards,
  getCurrentPlayer,
  setInitialized,
  isPlayerInGame,
  getSuitDominant,
  getMessages,
  getMapCountPlayers,
  isCurrentPlayer,
  initializePoints,
  getSeat,
  passCard,
  getTwoClubsHolder,
  getCurrentTurn,
  setPassed,
  getPlayersPassed,
  incrementTurnNumber
};
