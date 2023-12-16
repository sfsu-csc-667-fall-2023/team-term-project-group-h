const { Games, Users } = require("../../db");
const GAME_CONSTANTS = require("../../../constants/games");

const method = "post";
const route = "/:id/play";

const handler = async (request, response) => {
  const io = request.app.get("io");
  const { id: gameId } = request.params;
  const { id: userId } = request.session.user;
  const { cards: selectedCards, userSocketId } = request.body;
  const cardPlayed = selectedCards[0];
  
  const isPlayerInGame = await Games.isPlayerInGame(gameId, userId);

  if (!isPlayerInGame) {
    response.status(200).send();
    return;
  }

  const isCurrentPlayer = await Games.isCurrentPlayer(gameId, userId);

  if (!isCurrentPlayer) {
    io.to(userSocketId).emit(GAME_CONSTANTS.INVALID_PLAY, "It's not your turn.");
    return response.status(200).send();
  }

  const currentTurn = await Games.getCurrentTurn(gameId);

  if (currentTurn % 52 === 1 && cardPlayed != 15) {
    io.to(userSocketId).emit(GAME_CONSTANTS.INVALID_PLAY, "You must play the 2 of clubs first.");
    return response.status(200).send();
  }

  const { suits: cardPlayedSuit } = await Games.getCardSuit(cardPlayed);
  const { broken_hearts: brokenHearts } = await Games.getBrokenHearts(gameId);
  let { suit_dominant: currentSuit } = await Games.getDominantSuit(gameId);

  if(currentTurn % 4 === 1) {
    if(cardPlayedSuit === 3 && !brokenHearts) {
      io.to(userSocketId)
        .emit(GAME_CONSTANTS.INVALID_PLAY, "Cannot lead with heart until hearts are broken.");

      return response.status(200).send();
    }

    currentSuit= await Games.setDominantSuit(gameId, cardPlayedSuit);
  } else if (cardPlayedSuit !== currentSuit && await suitInHand(currentSuit, userId, gameId)) {
    io.to(userSocketId)
      .emit(GAME_CONSTANTS.INVALID_PLAY, "You must play according to the leading suit.");

    return response.status(200).send();
  }

  await Games.playCard(gameId, cardPlayed);

  const { value: cardPlayedNumber } = await Games.getCardNumber(cardPlayed);
  const { number_dominant: dominantNumber } = await Games.getDominantNumber(gameId);

  if(currentSuit === cardPlayedSuit && cardPlayedNumber > dominantNumber) {
    await Games.setDominantPlayer(userId, gameId);
    await Games.setDominantNumber(cardPlayedNumber, gameId);
  } else if(cardPlayedSuit === 3 && !brokenHearts) {
    await Games.setBrokenHeart(true, gameId);
  }

  let nextPlayer;
  if(currentTurn % 4 !== 0) {
    const { seat: currentSeat } = await Games.getSeat(userId, gameId);
    const seatNextPlayer = (currentSeat + 1) % 4;

    nextPlayer = (await Games.getPlayerBySeat(
      seatNextPlayer,
      gameId
    )).user_id;
  }else {
    nextPlayer = (await Games.getDominantPlayer(gameId)).player_dominant;
    await Games.setDominantNumber(0, gameId);
    await calculateRoundPoints(gameId, nextPlayer);
  }

  await Games.setCurrentPlayer(nextPlayer, gameId);

  const gameState = await Games.getState(gameId);

  io.to(gameState.game_socket_id).emit(
    GAME_CONSTANTS.STATE_UPDATED,
    gameState
  );

  if(currentTurn % 52 === 0) {
    await endGame(gameId, io);
    return response.status(200).send();
  }

  await Games.incrementTurnNumber(gameId);

  response.status(200).send();
};

const suitInHand = async (currentSuit, userId, gameId) => {
  const suitIdRange = [0, 14, 27, 40];

  const playerHand = await Games.getPlayerHand(gameId, userId);

  const suitAceId = suitIdRange[currentSuit];
  let suitKingId
  if(currentSuit === 3) {
    suitKingId = 52;  
  } else {
    suitKingId = suitIdRange[currentSuit + 1] - 1;
  }
    
  const matchingSuits = playerHand.filter(
    (card) => card.card_id >= suitAceId && card.card_id <= suitKingId && card.card_order > 0);
  
  if (matchingSuits.length === 0) {
    return false;
  }
  
  return true;
};

const calculateRoundPoints = async (gameId, loser) => {
  const floorCards = await Games.getFloorCards(gameId);

  let roundPoints = 0;
  for (const card of floorCards) {
    roundPoints += await Games.getCardPoints(card.card_id);
  }

  await Games.addPlayerPoints(gameId, loser, roundPoints);
  await Games.cleanFloor(gameId);
}

const endGame = async (gameId, io) => {
  const gameState = await Games.getState(gameId);

  const winners = await Games.getWinner(gameId);
  if(winners.length > 1)  {
    io.to(gameState.game_socket_id).emit(
      GAME_CONSTANTS.END_GAME,
      `ITS A ${winners.length} WAY TIE!`
    );

    return;
  }
  
  const winnerUsername = await Users.getUsername(winners[0].user_id);

  io.to(gameState.game_socket_id).emit(
    GAME_CONSTANTS.END_GAME,
    `${winnerUsername} won the match. Well played!`
  );
}

module.exports = { method, route, handler };
