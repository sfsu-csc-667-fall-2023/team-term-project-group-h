const { Games, Users } = require("../../db");
const GAME_CONSTANTS = require("../../../constants/games");

const method = "post";
const route = "/:id/passCards";

const handler = async (request, response) => {

  console.log("PASS CARDS");
  const io = request.app.get("io");
  
  const {id: gameId } = request.params;
  const { userId: user_Id, cards: selectedCards } = request.body;
  console.log(`request.body ${JSON.stringify(request.body)}`);

  console.log(`user_Id: ${user_Id}`);
  console.log(`selectedCards: ${selectedCards}`);
  console.log(`gameId: ${gameId}`);

  const { seat: userSeat } = await Games.getSeat(user_Id, gameId);
  console.log(`userSeat: ${userSeat}`);

  let targetSeat;
  if(userSeat === 3) {
    targetSeat = 0;
  } else {
    targetSeat = userSeat + 1;
  }
  console.log(`TARGET SEAT: ${targetSeat}`);

  const { user_id: targetUser } = await Games.getPlayerBySeat(targetSeat, gameId);

  for(const card of selectedCards) {
    await Games.passCard(card, targetUser, gameId);
  } 
  await Games.setPassed(user_Id, gameId);

  const playersPassed = await Games.getPlayersPassed(gameId);

  if(playersPassed === 4) {
    
    const { user_id: firstPlayer } = await Games.getTwoClubsHolder(gameId);
    await Games.setCurrentPlayer(firstPlayer, gameId); 
    await Games.incrementTurnNumber(gameId);
    const gameState = await Games.getState(gameId);
  
    io.to(gameState.game_socket_id).emit(GAME_CONSTANTS.STATE_UPDATED, gameState);
  }

  response.status(200).send();
};

module.exports = { method, route, handler };