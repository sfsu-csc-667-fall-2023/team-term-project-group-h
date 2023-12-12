const { Games } = require("../../db");
const GAME_CONSTANTS = require("../../../constants/games");

const method = "post";
const route = "/:id/play";

const handler = async (request, response) => {
  const io = request.app.get("io");
  const { id: gameId } = request.params;
  const { id: userId } = request.session.user;
  const { cards: selectedCards } = request.body;
  const cardPlayed = selectedCards[0];
  console.log("--- ENTERED PLAY ROUTE ---");
  console.log(`gameId: ${gameId}`);
  console.log(`userId: ${userId}`);
  console.log(`Selected cards: ${selectedCards}`);
  console.log(`cardPlayed: ${cardPlayed}`);

  const isPlayerInGame = await Games.isPlayerInGame(gameId, userId);
  console.log(`isPlayerInGame: ${isPlayerInGame}`);

  if (!isPlayerInGame) {
    response.status(200).send();
    return;
  }

  const isCurrentPlayer = await Games.isCurrentPlayer(gameId, userId);
  console.log(`isCurrentPlayer: ${isCurrentPlayer}`);

  if (!isCurrentPlayer) {
    return response.status(403).send("Not your turn!");
  }

  // const firstTurnInHand = currentTurn % 52;
  // Each hand consists of 52 turns.
  // The first turn of each hand, 2clubs must be played, so
  // turn 0 % 52, must play 2clubs
  // turn 52 % 52, must play 2clubs, etc.
  const currentTurn = await Games.getCurrentTurn(gameId);
  console.log(`currentTurn: ${currentTurn}`);
  if (currentTurn === 1) {
    if (cardPlayed != 15) {
      return response.status(403).send("Must play 2 of clubs first!");
    } else {
      await Games.setDominantSuit(gameId, 1);
      await Games.setDominantPlayer(userId, gameId);
      await Games.setDominantNumber(2, gameId);
    }
  } else {
    // if not first turn

    const currentSuit = await Games.getDominantSuit(gameId);
    console.log(`currentSuit: ${currentSuit}`);
    if (!noSuitInHand(currentSuit, userId) && currentSuit !== suit) {
      //Also, before this check, need to check the player's hand, if they have no cards with suit === currentSuit,
      //they can play whatever suit
      return response
        .status(403)
        .send("Must play according to the leading suit!");
    }
  }

  // if the round is not over
  if (currentTurn % 4 !== 0) {
    console.log("currentTurn % 4 !== 0");
    const { seat: currentSeat } = await Games.getSeat(userId, gameId);
    const seatNextPlayer = (currentSeat + 1) % 4;
    console.log(`seatNextPlayer: ${seatNextPlayer}`);
    const { user_id: nextPlayer } = await Games.getPlayerBySeat(
      seatNextPlayer,
      gameId
    );
    console.log(`nextPlayer: ${nextPlayer}`);
    await Games.setCurrentPlayer(nextPlayer, gameId);
    console.log("set current player");
    await Games.incrementTurnNumber(gameId);
    console.log("incremented turn number");
    // change card's order to zero
    await Games.playCard(gameId, cardPlayed);
    const gameState = await Games.getState(gameId);

    // Emit state updated event
    io.to(gameState.game_socket_id).emit(
      GAME_CONSTANTS.STATE_UPDATED,
      gameState
    );
  } else {
    // if the round is over
    const { player_dominant: nextPlayer } =
    await Games.getDominantPlayer(gameId);
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

const noSuitInHand = async (currentSuit, userId) => {
  const playerHand = await Games.getPlayerHand();
  console.log(`playerHand: ${playerHand}`);
};

module.exports = { method, route, handler };
