const { getCards } = require("./get-cards");
const { getGame } = require("./get-game");
const { getUsers } = require("./get-users");

const getState = async (gameId) => {
  const { game_socket_id, turn_number, broken_hearts, suit_dominant, player_dominant, number_dominant, turn_player_id  } = await getGame(gameId);

  console.log(`game_socket_id: ${game_socket_id}`);
  let current_player;
  // const current_player = await getCurrentTurn(gameId);
  const users = await getUsers(gameId);

  const dealtCards = await getCards(gameId);
  // console.log({ dealtCards });

  users.forEach((user) => {
    console.log(`user.game_points = ${user.game_points}, user.hand_points = ${user.hand_points}`);

    user.hand = dealtCards.filter((card) => card.user_id === user.user_id);
    // user.hand.map((card) => {
    //   card.order = Games.getCardOrder(card);
    //   return card;
    // });
    user.current_player = current_player === user.user_id;
  });

  return {
    game_id: gameId,
    game_socket_id,
    current_player: turn_player_id,
    players: users,
    broken_hearts,
    turn_number
  };
};

module.exports = { getState };