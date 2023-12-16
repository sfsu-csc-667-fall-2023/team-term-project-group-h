const { getUsername } = require("../users");
const { getCards } = require("./get-cards");
const { getGame } = require("./get-game");
const { getUsers } = require("./get-users");

const getState = async (gameId) => {
  const { game_socket_id, turn_number, broken_hearts, turn_player_id  } = await getGame(gameId);

  let current_player;
  
  const users = await getUsers(gameId);
  let currentUsername;
  if(turn_player_id) {
    currentUsername = await getUsername(turn_player_id);
  }

  const dealtCards = await getCards(gameId);

  users.forEach((user) => {
    user.hand = dealtCards.filter((card) => card.user_id === user.user_id);

    user.current_player = current_player === user.user_id;
  });

  return {
    game_id: gameId,
    game_socket_id,
    current_player: turn_player_id,
    players: users,
    broken_hearts,
    turn_number,
    currentUsername
  };
};

module.exports = { getState };