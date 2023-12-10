const { createShuffledDeck } = require("./create-shuffled-deck");
const { getUsers } = require("./get-users");
const { getGame } = require("./get-game");
const { getPlayerBySeat } = require("./get-player-by-seat");
const { setCurrentPlayer } = require("./set-current-player");
const { drawCards } = require("./draw-cards");
const { dealCards } = require("./deal-cards");
const {setInitialized} = require("./set-initialized");
const { getCards } = require("./get-cards");
const { initializePoints } = require("../games");

const initialize = async (gameId) => {
  const { game_socket_id } = await getGame(gameId);

  await createShuffledDeck(gameId);

  // first player is the one with 2 of spades. How query for which player has two of spade after cards are dealt?
  const firstPlayer = await getPlayerBySeat(0, gameId).then(({ user_id }) =>
    setCurrentPlayer(user_id, gameId),
  );

  const cards = await drawCards(gameId, 52);
  const users = await getUsers(gameId);
  await dealCards(users, cards, gameId);
  const dealtCards = await getCards(gameId);

  users.forEach((user) => {
    console.log({ user });

    user.hand = dealtCards.filter((card) => card.user_id === user.user_id);
    user.current_player = firstPlayer === user.user_id;
  });

  await setInitialized(gameId);
  await initializePoints(gameId);

  return {
    game_id: gameId,
    game_socket_id,
    current_player: firstPlayer,
    players: users,
  };
};

module.exports = { initialize };