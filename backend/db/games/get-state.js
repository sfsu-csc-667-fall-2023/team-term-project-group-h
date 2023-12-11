const database = require("../connection");
const { connection: db } = database;

const { getCards } = require("./get-cards");
const { getCurrentTurn } = require("./get-current-turn");
const { getGame } = require("./get-game");
const { getUsers } = require("./get-users");

const getState = async (gameId) => {
  const { game_socket_id } = await getGame(gameId);

  const current_player = await getCurrentTurn(gameId);
  const users = await getUsers(gameId);

  const dealtCards = await getCards(gameId);
  console.log({ dealtCards });

  users.forEach((user) => {
    console.log(`user.game_points = ${user.game_points}, user.hand_points = ${user.hand_points}`);

    user.hand = dealtCards.filter((card) => card.user_id === user.user_id);
    user.current_player = current_player === user.user_id;
  });

  return {
    game_id: gameId,
    game_socket_id,
    current_player,
    players: users,
  };
};

module.exports = { getState };