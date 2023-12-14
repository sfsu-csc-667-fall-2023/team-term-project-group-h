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
  
  console.log("--- ENTERED PLAY ROUTE ---");
  console.log(`gameId: ${gameId}`);
  console.log(`userId: ${userId}`);
  console.log(`Selected cards: ${selectedCards}`);
  
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

  const currentTurn = await Games.getCurrentTurn(gameId);
  console.log(`currentTurn: ${currentTurn}`);
  //1st turn in 1st round: 2clubs check
  if (currentTurn % 54 === 1 && cardPlayed != 15) {
    io.to(userSocketId).emit(GAME_CONSTANTS.INVALID_PLAY, "You must play the 2 of clubs first.");
    return response.status(200).send();
  }

  const { suits: cardPlayedSuit } = await Games.getCardSuit(cardPlayed);
  const { broken_hearts: brokenHearts } = await Games.getBrokenHearts(gameId);
  const { suit_dominant: currentSuit } = await Games.getDominantSuit(gameId);

  //1st turn in any round: "is heart broken?" check
  //any other turn: matching suit check
  if(currentTurn % 4 === 1) {
    if(cardPlayedSuit === 3 && !brokenHearts) {
      io.to(userSocketId)
        .emit(GAME_CONSTANTS.INVALID_PLAY, "Cannot lead with heart until hearts are broken.");

      return response.status(200).send();
    }

    await Games.setDominantSuit(gameId, cardPlayedSuit);
  } else if (cardPlayedSuit !== currentSuit && await suitInHand(currentSuit, userId, gameId)) {
    io.to(userSocketId)
      .emit(GAME_CONSTANTS.INVALID_PLAY, "You must play according to the leading suit.");

    return response.status(200).send();
  }

  await Games.playCard(gameId, cardPlayed);

  const { value: cardPlayedNumber } = await Games.getCardNumber(cardPlayed);
  const { number_dominant: dominantNumber } = await Games.getDominantNumber(gameId);
  console.log(`cardPlayed: ${cardPlayed} suit ${cardPlayedSuit} number ${cardPlayedNumber}`);
  console.log(`currentSuit: ${currentSuit}`);
  console.log(`dominantNumber: ${dominantNumber}`);

  if(currentSuit === cardPlayedSuit && cardPlayedNumber > dominantNumber) {
    await Games.setDominantPlayer(userId, gameId);
    await Games.setDominantNumber(cardPlayedNumber, gameId);
  } else if(cardPlayedSuit === 3 && !brokenHearts) {
    await Games.setBrokenHeart(true, gameId);
  }

  // if the round is not over
  let nextPlayer;
  if(currentTurn % 4 !== 0) {
    console.log("currentTurn % 4 !== 0");
    const { seat: currentSeat } = await Games.getSeat(userId, gameId);
    const seatNextPlayer = (currentSeat + 1) % 4;
    console.log(`seatNextPlayer: ${seatNextPlayer}`);
    nextPlayer = (await Games.getPlayerBySeat(
      seatNextPlayer,
      gameId
    )).user_id;
    console.log(`nextPlayer: ${nextPlayer}`);
  }else {  // if the round is over
    nextPlayer = (await Games.getDominantPlayer(gameId)).player_dominant;
    await Games.setDominantNumber(0, gameId);
    await calculateRoundPoints(gameId, nextPlayer);
  }
  
  await Games.incrementTurnNumber(gameId);
  await Games.setCurrentPlayer(nextPlayer, gameId);

  const gameState = await Games.getState(gameId);

  io.to(gameState.game_socket_id).emit(
    GAME_CONSTANTS.STATE_UPDATED,
    gameState
  );

  response.status(200).send();
};

const suitInHand = async (currentSuit, userId, gameId) => {
  console.log("--- ENTERED suitInHand ---");
  const suitIdRange = [0, 14, 27, 40];

  const playerHand = await Games.getPlayerHand(gameId, userId);
  // console.log(`playerHand: ${JSON.stringify(playerHand)}`);

  const suitAceId = suitIdRange[currentSuit];
  const suitKingId = suitIdRange[currentSuit + 1] - 1;
  console.log(`suitAceId: ${suitAceId}`);
  console.log(`suitKingId: ${suitKingId}`);
    
  const matchingSuits = playerHand.filter(
    (card) => card.card_id >= suitAceId && card.card_id <= suitKingId && card.card_order > 0);
  console.log(`matchingSuits: ${JSON.stringify(matchingSuits)}`);
  
  if (matchingSuits.length === 0) {
    console.log("returning false");
    return false;
  }
  
  console.log("returning true");
  return true;
};

const calculateRoundPoints = async (gameId, loser) => {
  const floorCards = await Games.getFloorCards(gameId);

  let roundPoints = 0;
  for (const card of floorCards) {
    roundPoints += await Games.getCardPoints(card.card_id);
  }
  console.log(`roundPoints: ${roundPoints}`);
  await Games.addPlayerPoints(gameId, loser, roundPoints);
  await Games.cleanFloor(gameId);
}

module.exports = { method, route, handler };
