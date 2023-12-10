const { Games } = require("../../db");

const method = "get";
const route = "/:id/join";

const GAME_CONSTANTS = require("../../../constants/games");

const handler = async (request, response) => {
    const { id: gameId } = request.params;
    const { id: userId } = request.session.user;

    if(Games?.isInitialized(gameId)) {
        console.log("Games is already initialized");
    }else{
        console.log("Games is not initialized");
    }

    const usersInGame = await Games.usersInGame(gameId);

    const userAlreadyInGame = usersInGame.some(
        (entry) => entry.user_id === userId)


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