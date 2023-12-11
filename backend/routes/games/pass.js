const { Games, Users } = require("../../db");
const { getSeat, passCard, getState } = require("../../db/games");
const { getPlayerBySeat } = require("../../db/games/get-player-by-seat");
const GAME_CONSTANTS = require("../../../constants/games");

const method = "post";
const route = "/:id/passCards";

const handler = async (request, response) => {
  const io = request.app.get("io");
  const { id: gameId } = request.params;
  const { selectedCards } = request.body;
  const { user_id: userId } = selectedCards[0];

  console.log(userId);
  console.log(selectedCards);

  const { seat: userSeat } = await getSeat(userId, gameId);
  console.log(userSeat);

  let targetSeat;
  if(userSeat === 3) {
    targetSeat = 0;
  } else {
    targetSeat = userSeat + 1;
  }
  console.log(targetSeat);

  const { user_id: targetUser } = await getPlayerBySeat(targetSeat, gameId);

  console.log(targetUser);

  for(const card of selectedCards) {
    const { card_id: cardId } = card
    await passCard(cardId, targetUser, gameId);
  }

  const gameState = await getState(gameId);

  io.to(gameState.game_socket_id).emit(GAME_CONSTANTS.STATE_UPDATED, gameState);
};

module.exports = { method, route, handler };