const { createShuffledDeck } = require("./create-shuffled-deck");
const { getUsers } = require("./get-users");
const { getGame } = require("./get-game");
const { drawCards } = require("./draw-cards");
const { dealCards } = require("./deal-cards");
const { setInitialized } = require("./set-initialized");
const { getCards } = require("./get-cards");
const { initializePoints } = require("./initialize-points");
const { getCurrentPlayer } = require("./get-current-player");

const initialize = async (gameId) => {
  const { game_socket_id } = await getGame(gameId);

  await createShuffledDeck(gameId);


  const cards = await drawCards(gameId, 52);
  const users = await getUsers(gameId);
  await dealCards(users, cards, gameId);
  const dealtCards = await getCards(gameId);
  const current_player = await getCurrentPlayer(gameId);

  users.forEach((user) => {
    console.log({ user });

    user.hand = dealtCards.filter((card) => card.user_id === user.user_id);
    user.current_player = true;
  });

  await setInitialized(gameId);
  await initializePoints(gameId);

  return {
    game_id: gameId,
    game_socket_id,
    current_player,
    players: users,
  };
};

module.exports = { initialize };