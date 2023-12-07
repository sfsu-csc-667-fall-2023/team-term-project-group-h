const { Games, Users } = require("../../db");

const method = "get";
const route = "/:id/join";

const GAME_CONSTANTS = require("../../../constants/games");

const handler = async (request, response) => {
    const { id: gameId } = request.params;
    const { id: userId } = request.session.user;

    const usersInGame = await Games.usersInGame(gameId);

    console.log(userId);
    console.log({ usersInGame });

    const userAlreadyInGame = usersInGame.some(
        (entry) => entry.user_id === userId)

    console.log(userAlreadyInGame);


    if(!userAlreadyInGame) {
        await Games.addUser(userId, gameId);
    }

    response.redirect(`/game/${gameId}`);
  
    
    
    // io.emit(GAME_CONSTANTS.USER_ADDED, { userId, userEmail, gameId });
  
    // const userCount = await Games.userCount(gameId);
  
    // if(userCount === 4) {
    //   const gameState = await Games.initialize(gameId);
    //   const { game_socket_id: gameSocketId } = await Games.getGame(gameId);
  
    //   io.to(gameSocketId).emit(GAME_CONSTANTS.START, {
    //     currentPlayer: gameState.current_player,
    //   });
    //   Object.keys(gameState.hands).forEach((playerId) => {
    //     const playerSocket = Users.getUserSocket(playerId);
  
    //     io.to(playerSocket).emit(GAME_CONSTANTS.STATE_UPDATED, {
    //       hand: gameState.hands[playerId],
    //     });
    //   });
    // }
  
    
};

module.exports = { method, route, handler };