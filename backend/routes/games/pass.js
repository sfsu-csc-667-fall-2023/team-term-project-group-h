const { Games, Users } = require("../../db");
const { getSeat, passCard, getState, getTwoClubsHolder } = require("../../db/games");
const { getPlayerBySeat } = require("../../db/games/get-player-by-seat");
const GAME_CONSTANTS = require("../../../constants/games");
const { setCurrentPlayer } = require("../../db/games/set-current-player");

const method = "post";
const route = "/:id/passCards";

const handler = async (request, response) => {
  const io = request.app.get("io");
  const {id: gameId } = request.params;
  const {user_id: userId, card: selectedCards} = request.body;

  console.log(userId);
  console.log(selectedCards);
  console.log(gameId);
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
  for( const card of selectedCards) {
      console.log("PASSING CARDS");
      console.log(card);
      console.log(targetUser);
      console.log(gameId);
  }

  // for(const card of selectedCards) {
  //   await passCard(card, targetUser, gameId);
  // } 

  // const firstPlayer = await getTwoClubsHolder(gameId);
  // const firstPlayerSeat = await getSeat(firstPlayer);
  // await setCurrentPlayer(firstPlayerSeat);

  // const gameState = await getState(gameId);

  // io.to(gameState.game_socket_id).emit(GAME_CONSTANTS.STATE_UPDATED, gameState);
};

module.exports = { method, route, handler };