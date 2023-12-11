const { Games } = require("../../db");

const method = "post";
const route = "/:id/play";

const handler = async (request, response) => {
  const { id: gameId } = request.params;
  const { id: userId } = request.session.user;
  const { cards: selectedCards } = request.body;
  const cardPlayed = selectedCards[0];

  const isPlayerInGame = Games.isPlayerInGame(gameId, userId);

  if (!isPlayerInGame) {
    response.status(200).send();
    return;
  }

  const isCurrentPlayer = Games.isCurrentPlayer(gameId, userId);

  if (isCurrentPlayer !== userId) {
    return response.status(403).send("Not your turn!");
  }

  const currentTurn = Games.getCurrentTurn(gameId);

  // const firstTurnInHand = currentTurn % 52;

  const currentSuit = Games.getSuitDominant(gameId);

  // Each hand consists of 52 turns.
  // The first turn of each hand, 2clubs must be played, so
  // turn 0 % 52, must play 2clubs
  // turn 52 % 52, must play 2clubs, etc.

  if (currentTurn === 1) {
    if (cardPlayed != 15) {
      //NOT 2clubs in first turn
      return response.status(403).send("Must play 2 of clubs first!");
    } else {
      await Games.setSuitDominant(1, gameId);
      await Games.setPlayerDominant(userId, gameId);
      await Games.setNumberDominant(2, gameId);
      await Games.setBrokenHearts(false, gameId);
    }
  } else {
    if (!noSuitInHand(currentSuit) && currentSuit !== suit) {
      //Also, before this check, need to check the player's hand, if they have no cards with suit === currentSuit,
      //they can play whatever suit
      return response
        .status(403)
        .send("Must play according to the first suit!");
    }
  }

  // if the round is not over
  if (currentTurn % 4 !== 0) {

    const seatNextPlayer = ((await Games.getSeat(userId, gameId))+1)%4;
    const nextPlayer = await Games.getPlayerBySeat(seatNextPlayer, gameId);
    await Games.setTurnPlayer(nextPlayer, gameId);
    await Games.incrementTurnNumber(gameId);
    const gameState = await Games.getState(gameId);

    // Emit state updated event
    io.to(gameState.game_socket_id).emit(
      GAME_CONSTANTS.STATE_UPDATED,
      gameState
    );
  } else {

    // if the round is over
    const nextPlayer = await Games.getDominantPlayer(gameId);
    await Games.setTurnPlayer(nextPlayer, gameId);
    await Games.incrementTurnNumber(gameId);
    
    // add points to the player who won the round

    const gameState = await Games.getState(gameId);
    // Emit state updated event
    io.to(gameState.game_socket_id).emit(
      GAME_CONSTANTS.STATE_UPDATED,
      gameState
    );
  }

  response.status(200).send();
};

const noSuitInHand = async (currentSuit) => {};

module.exports = { method, route, handler };
