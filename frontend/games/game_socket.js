import { io } from "socket.io-client";
import * as GAME_CONSTANTS from "@constants/games";

let gameSocket;

const configure = (socketId) => {
  gameSocket = io({ query: { id: socketId } });

  gameSocket.on(GAME_CONSTANTS.STATE_UPDATED, stateUpdated);

  console.log("Game socket configured");

  return Promise.resolve(gameSocket);
};

const cardTemplate = document.querySelector("#card");

const playerOneHand = document.querySelector(".player-one-hand");
const playerTwoHand = document.querySelector(".player-two-hand");
const playerThreeHand = document.querySelector(".player-three-hand");
const playerFourHand = document.querySelector(".player-four-hand");

const updateHand = (handContainer, cardList, game_id) => {
  const suitsMap = {
    0: "spades",
    1: "clubs",
    2: "hearts",
    3: "diamonds",
  };

  
  handContainer.innerHTML = "";


  cardList.forEach(({ suits, value }) => {

    const container = cardTemplate.content.cloneNode(true);
    const div = container.querySelector(".card");

    div.classList.add(`suit-${suits}`);
    div.classList.add(`value-${value}`);
    
    div.innerText = `${value} of ${suitsMap[suits]}`;
    // div.addEventListener("click", () => {
    //   // change to opaque if not already present otherwise remove
    //   div.classList.contains("opaque") ? div.classList.remove("opaque") : div.classList.add("opaque");
      
    //   fetch(`/game/${game_id}/play`, { method: "post", body: {
    //       "suit": suits,
    //       "value": value
    //     }
    //   })
    // });

    handContainer.appendChild(div);
  });
};

const updatePoints = (players) => {
  players.forEach((player) => {
    const playerPoints = document.getElementById(`player-${player.seat+1}-points`);
    if (playerPoints) {
      playerPoints.innerText = `USER: ${player.username}, POINTS: ${player.hand_points} `;
      console.log(`Player ${player.seat} has ${player.game_points} game points, ${player.hand_points} hand points`);
    } else {
      console.error(`Element not found for seat ${player.seat}`);
    }
  });
}

const stateUpdated = ({ game_id, current_player, players }) => {

  if(players.length === 4) {

    updatePoints(players);
    const seatZeroCards = players.find((player) => player.seat === 0).hand;
    const seatOneCards = players.find((player) => player.seat === 1).hand;

    const seatTwoCards = players.find((player) => player.seat === 2).hand;          // commented out for easier testing with 2 players
    const seatThreeCards = players.find((player) => player.seat === 3).hand;
    // console.log({ seatZeroCards, seatOneCards });
    updateHand(playerOneHand, seatZeroCards,game_id);
    updateHand(playerTwoHand, seatOneCards,game_id);
    updateHand(playerThreeHand, seatTwoCards, game_id);
    updateHand(playerFourHand, seatThreeCards, game_id);
  }

};

export { configure };