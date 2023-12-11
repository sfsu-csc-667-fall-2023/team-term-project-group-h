const { createShuffledDeck } = require("./create-shuffled-deck");
const { getUsers } = require("./get-users");
const { getGame } = require("./get-game");
const { drawCards } = require("./draw-cards");
const { dealCards } = require("./deal-cards");
const { setInitialized } = require("./set-initialized");
const { getCards } = require("./get-cards");
const { initializePoints } = require("./initialize-points");
const { getCurrentTurn } = require("./get-current-turn");

const initialize = async (gameId) => {

  const { game_socket_id, turn_number, broken_hearts, suit_dominant, player_dominant, Number_dominant, turn_player_id  } = await getGame(gameId);

  

  await createShuffledDeck(gameId);

  const cards = await drawCards(gameId, 52);
  const users = await getUsers(gameId);
  await dealCards(users, cards, gameId);
  const dealtCards = await getCards(gameId);
  await initializePoints(gameId);
  // const current_player = await getCurrentTurn(gameId);
  let current_player;

  users.forEach((user) => {
    console.log({ user });

    user.hand = dealtCards.filter((card) => card.user_id === user.user_id);
    user.current_player = true;
  });

  
  await setInitialized(gameId);
  

  return {
    game_id: gameId,
    game_socket_id,
    current_player: turn_player_id,
    players: users,
    broken_hearts,
    turn_number
  };
};

module.exports = { initialize };