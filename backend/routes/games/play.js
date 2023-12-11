const { Games } = require("../../db");

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

  if(isCurrentPlayer !== userId) {
    return response.status(403).send("Not your turn!");
  }

  const currentTurn = Games.getCurrentTurn(gameId);
  const firstTurnInHand = currentTurn % 52;
  const currentSuit = Games.getSuitDominant(gameId);

  // Each hand consists of 52 turns.
  // The first turn of each hand, 2clubs must be played, so
  // turn 0 % 52, must play 2clubs
  // turn 52 % 52, must play 2clubs, etc.

  if(firstTurnInHand === 0) {
    if(suit !== 1 && value !== 2) {
      return response.status(403).send("Must play 2 of clubs first!");    
    }
  } else {
    if(!noSuitInHand(currentSuit) && currentSuit !== suit) {
      //Also, before this check, need to check the player's hand, if they have no cards with suit === currentSuit,
      //they can play whatever suit
      return response.status(403).send("Must play according to the first suit!");
    }
  }

  response.status(200).send();
}

const noSuitInHand = async (currentSuit) => {
}

module.exports = { method, route, handler };