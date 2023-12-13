const { Games } = require("../../db");
const GAME_CONSTANTS = require("../../../constants/games");

const method = "post";
const route = "/:id/play";

const handler = async (request, response) => {
  const io = request.app.get("io");
  const { id: gameId } = request.params;
  const { id: userId } = request.session.user;
  const { cards: selectedCards, userSocketId } = request.body;
  const cardPlayed = selectedCards[0];

  const { suits: cardPlayedSuit } = await Games.getCardSuit(cardPlayed);
  const { value: cardPlayedNumber } = await Games.getCardNumber(cardPlayed);
  const { suit_dominant: currentSuit } = await Games.getDominantSuit(gameId);
  const { broken_hearts: brokenHearts } = await Games.getBrokenHearts(gameId);
  const { number_dominant: dominantNumber } = await Games.getDominantNumber(gameId);

  console.log("--- ENTERED PLAY ROUTE ---");
  console.log(`gameId: ${gameId}`);
  console.log(`userId: ${userId}`);
  console.log(`Selected cards: ${selectedCards}`);
  console.log(`cardPlayed: ${cardPlayed} suit ${cardPlayedSuit} number ${cardPlayedNumber}`);

  const isPlayerInGame = await Games.isPlayerInGame(gameId, userId);
  console.log(`isPlayerInGame: ${isPlayerInGame}`);

  if (!isPlayerInGame) {
    response.status(200).send();
    return;
  }

  const isCurrentPlayer = await Games.isCurrentPlayer(gameId, userId);
  console.log(`isCurrentPlayer: ${isCurrentPlayer}`);

  if (!isCurrentPlayer) {
    io.to(userSocketId).emit(GAME_CONSTANTS.INVALID_PLAY, "It's not your turn.");
    return response.status(200).send();
  }

  //1st turn in 1st round: 2clubs check
  const currentTurn = (await Games.getCurrentTurn(gameId));
  console.log(`currentTurn: ${currentTurn}`);
  if (currentTurn % 54 === 1 && cardPlayed != 15) {
    io.to(userSocketId).emit(GAME_CONSTANTS.INVALID_PLAY, "You must play the 2 of clubs first.");
    return response.status(200).send();
  }

  //1st turn in any round: "is heart broken?" check
  //any other turn: matching suit check
  if(currentTurn % 4 === 1) {
    if(cardPlayedSuit === 3 && !brokenHearts) {
      io.to(userSocketId).emit(GAME_CONSTANTS.INVALID_PLAY, "Cannot lead with a heart until hearts are broken.");
      return response.status(200).send();
    }

    await Games.setDominantSuit(gameId, cardPlayedSuit);
  } else if (cardPlayedSuit !== currentSuit && await suitInHand(currentSuit, userId, gameId)) {
    console.log(`currentSuit Dominant: ${(currentSuit)}`);
    console.log(`cardPlayed.suit: ${cardPlayedSuit}`);
    io.to(userSocketId)
      .emit(GAME_CONSTANTS.INVALID_PLAY, "You must play according to the leading suit.");

    return response.status(200).send();
  }

  // if the round is not over
  let nextPlayer;
  if (currentTurn % 4 !== 0) {
    console.log("currentTurn % 4 !== 0");
    const { seat: currentSeat } = await Games.getSeat(userId, gameId);
    const seatNextPlayer = (currentSeat + 1) % 4;
    console.log(`seatNextPlayer: ${seatNextPlayer}`);
    nextPlayer = (await Games.getPlayerBySeat(
      seatNextPlayer,
      gameId
    )).user_id;
    console.log(`nextPlayer: ${nextPlayer}`);
    // change card's order to zero
    await Games.playCard(gameId, cardPlayed);

    if(currentSuit === cardPlayedSuit) {
      if(cardPlayedNumber > dominantNumber) {
        await Games.setDominantPlayer(userId, gameId);
        await Games.setDominantNumber(cardPlayedNumber, gameId);
      }
    } else if(cardPlayedSuit === 3 && !brokenHearts) {
      await Games.setBrokenHeart(true, gameId);
    }
  } else {
    // if the round is over
    nextPlayer = (await Games.getDominantPlayer(gameId)).player_dominant;
    // add points to the player who won the round
  }
  
  await Games.incrementTurnNumber(gameId);
  await Games.setCurrentPlayer(nextPlayer, gameId);

  const gameState = await Games.getState(gameId);
    // Emit state updated event
  io.to(gameState.game_socket_id).emit(
    GAME_CONSTANTS.STATE_UPDATED,
    gameState
  );

  response.status(200).send();
};

const suitInHand = async (currentSuit, userId, gameId) => {
  console.log("--- ENTERED noSuitInHand ---");
  const suitIdRange = [0, 14, 27, 40];

  const playerHand = await Games.getPlayerHand(gameId, userId);
  // console.log(`playerHand: ${JSON.stringify(playerHand)}`);

  const suitAceId = suitIdRange[currentSuit];
  const suitKingId = suitIdRange[currentSuit + 1] - 1;
  console.log(`suitAceId: ${suitAceId}`);
  console.log(`suitKingId: ${suitKingId}`);
    
  const matchingSuits = playerHand.filter(
    (card) => card.card_id >= suitAceId && card.card_id <= suitKingId);
  console.log(`matchingSuits: ${JSON.stringify(matchingSuits)}`);
  
  if (matchingSuits.length === 0) {
    console.log("returning false");
    return false;
  }
  
  console.log("returning true");
  return true;
};

module.exports = { method, route, handler };
