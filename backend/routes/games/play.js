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

  // const firstTurnInHand = currentTurn % 52;
  // Each hand consists of 52 turns.
  // The first turn of each hand, 2clubs must be played, so
  // turn 0 % 52, must play 2clubs
  // turn 52 % 52, must play 2clubs, etc.
  const currentTurn = (await Games.getCurrentTurn(gameId));
  console.log(`currentTurn: ${currentTurn}`);
  if (currentTurn === 1) {
    if (cardPlayed != 15) {
      io.to(userSocketId).emit(GAME_CONSTANTS.INVALID_PLAY, "You must play 2 of clubs first.");
      return response.status(200).send();
    } else {
      await Games.setDominantSuit(gameId, 1);
      await Games.setDominantPlayer(userId, gameId);
      await Games.setDominantNumber(2, gameId);
    }
  } else {
    // if not first turn
    console.log(`currentSuit Dominant: ${(currentSuit)}`);
    console.log(`cardPlayed.suit: ${cardPlayedSuit}`);
    if (cardPlayedSuit !== currentSuit && noSuitInHand(currentSuit, userId, gameId)) {
      io.to(userSocketId)
        .emit(GAME_CONSTANTS.INVALID_PLAY, "You must play according to the leading suit.");

      return response.status(200).send();
    }
  }

  
  //TODO when currTurn % 4 = 1 (first turn in a round), there is no domSuit. Can play whatever suit except heart
  //TODO need a check for heart not broken yet
  //TODO remove setDomSuit in line 52, set dom suit down here when currTurn % 4 = 1

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

    if(currentSuit !== cardPlayedSuit && cardPlayedSuit) {
      if(cardPlayedSuit === 3) {
        await Games.setBrokenHeart(true, gameId);
      }
    }

    //TODO set dominant player only when playedSuit == currentSuit and playedNumber > dominantNumber

    await Games.setDominantPlayer(userId, gameId);
    await Games.setDominantNumber(cardPlayedNumber, gameId);
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

const noSuitInHand = async (currentSuit, userId, gameId) => {
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
    return true;
  }
  
  return false;
};

module.exports = { method, route, handler };
