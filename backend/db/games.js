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
const { getDominantSuit } = require("./games/get-dominant-suit");
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
const { getPlayerBySeat } = require("./games/get-player-by-seat");
const { setCurrentPlayer } = require("./games/set-current-player");
const { setDominantSuit } = require("./games/set-dominant-suit");
const { setDominantPlayer } = require("./games/set-dominant-player");
const { setDominantNumber } = require("./games/set-dominant-number");
const { getDominantPlayer } = require("./games/get-dominant-player");
const { getPlayerHand } = require("./games/get-player-hand");
const { setBrokenHeart } = require("./games/set-broken-heart");
const { playCard } = require("./games/play-card");
const { getCardSuit } = require("./games/get-card-suit");
const { getCardNumber } = require("./games/get-card-number");
const { getBrokenHearts } = require("./games/get-broken-hearts");
const { getDominantNumber } = require("./games/get-dominant-number");
const { getFloorCards } = require("./games/get-floor-cards");
const { getCardPoints } = require("./games/get-card-points");
const { addPlayerPoints } = require("./games/add-player-points");
const { cleanFloor } = require("./games/clean-floor");

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
  getDominantSuit,
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
  incrementTurnNumber,
  getPlayerBySeat,
  setCurrentPlayer,
  setDominantSuit,
  setDominantPlayer,
  setDominantNumber,
  getDominantPlayer,
  getPlayerHand,
  setBrokenHeart,
  playCard,
  getCardSuit,
  getCardNumber,
  getBrokenHearts,
  getDominantNumber,
  getFloorCards,
  getCardPoints,
  addPlayerPoints,
  cleanFloor
};
