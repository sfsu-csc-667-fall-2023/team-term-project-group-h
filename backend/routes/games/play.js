const { Games, Users } = require("../../db");

const method = "post";
const route = "/:id/play";

const handler = async (request, response) => {
    const { id: gameId } = request.params;
    const { id: userId } = request.session.user;
    const { suit, value } = request.body;

    const isPlayerInGame = Games.isPlayerInGame(gameId, userId);

    if(!isPlayerInGame) {
        response.status(200).send();
        return;
    }

    const isCurrentPlayer = Games.isCurrentPlayer(gameId, userId);

    if(!isCurrentPlayer) {
        //not your turn error msg, emit to player
        response.status(200).send();
        return;
    }

    //check first card played is 2 of spades

    const currentSuit = Games.getSuitDominant(gameId);
    if(!currentSuit && (suit !== 0) && (value !== 2)) {
       //first card played is 2 of spades error msg, emit to player
       response.status(200).send();
       return; 
    }

    if(currentSuit !== suit) {
        //incorrect suit error msg, emit to player
        response.status(200).send();
        return;
    }
}

module.exports = { method, route, handler };