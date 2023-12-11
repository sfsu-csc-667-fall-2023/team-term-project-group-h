const { Games } = require("../../db");

const method = "post";
const route = "/:id/play";

const handler = async (request, response) => {
  const { id: gameId } = request.params;
  const { id: userId } = request.session.user;
  const { cards: selectedCards } = request.body;
  const cardPlayed = selectedCards[0];
  console.log("--- ENTERED PLAY ROUTE ---");
  console.log(`gameId: ${gameId}`);
  console.log(`userId: ${userId}`);
  console.log(JSON.stringify(selectedCards));
  console.log(`cardPlayed: ${cardPlayed}`);

  const isPlayerInGame = await Games.isPlayerInGame(gameId, userId);
  console.log(`isPlayerInGame: ${isPlayerInGame}`);

  if (!isPlayerInGame) {
    response.status(200).send();
    return;
  }

  const isCurrentPlayer = await Games.isCurrentPlayer(gameId, userId);
  console.log(`isCurrentPlayer: ${isCurrentPlayer}`);

  if (isCurrentPlayer !== userId) {
    return response.status(403).send("Not your turn!");
  }

  const currentTurn = await Games.getCurrentTurn(gameId);
  const currentSuit = Games.getDominantSuit(gameId);
  console.log(`currentTurn: ${currentTurn}`);
  console.log(`currentSuit: ${currentSuit}`);

  // const firstTurnInHand = currentTurn % 52;
  // Each hand consists of 52 turns.
  // The first turn of each hand, 2clubs must be played, so
  // turn 0 % 52, must play 2clubs
  // turn 52 % 52, must play 2clubs, etc.

  if (currentTurn === 1) {
    if (cardPlayed != 15) {
      return response.status(403).send("Must play 2 of clubs first!");
    } else {
      await Games.setDominantSuit(1, gameId);
      await Games.setDominantPlayer(userId, gameId);
      await Games.setDominantNumber(2, gameId);
    }
  } else {
    if (!noSuitInHand(currentSuit) && currentSuit !== suit) {
      //Also, before this check, need to check the player's hand, if they have no cards with suit === currentSuit,
      //they can play whatever suit
      return response
        .status(403)
        .send("Must play according to the leading suit!");
    }
  }

  // if the round is not over
  if (currentTurn % 4 !== 0) {
    const seatNextPlayer = ((await Games.getSeat(userId, gameId))+1)%4;
    const nextPlayer = await Games.getPlayerBySeat(seatNextPlayer, gameId);
    await Games.setCurrentPlayer(nextPlayer, gameId);
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
    await Games.setCurrentPlayer(nextPlayer, gameId);
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
