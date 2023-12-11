import { io } from "socket.io-client";
import * as GAME_CONSTANTS from "@constants/games";

let gameSocket;
let selectedCards = [];

const roomId = document.querySelector("#roomId").value;
// const playButton = document.querySelector("#play-button");   TODO: make play button
const passButton = document.querySelector("#PassButton");

const showPassButton = () => {
  passButton.style.visibility="visible";
  // playButton.style.visibility="hidden";
};

const showPlayButton = () => {
  passButton.style.visibility="hidden";
  // playButton.style.visibility="visible";
};

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

  console.log(`Updating hand for game ${game_id} in handContainer ${handContainer}`);

  handContainer.innerHTML = "";


  cardList.forEach(({ suits, value, card_id, user_id }) => {
    console.log(value);

    const container = cardTemplate.content.cloneNode(true);
    const div = container.querySelector(".card");

    div.classList.add(`suit-${suits}`);
    div.classList.add(`value-${value}`);
    
    div.innerText = `${value} of ${suitsMap[suits]}`;
    div.addEventListener("click", () => {
      selectedCards.push({ card_id, user_id });

      console.log(JSON.stringify(selectedCards));
    });

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
  const { turn_number } = current_player;

  if(players.length === 2) {
    if(turn_number === 0) {
      showPassButton();
    } else {
      showPlayButton();
    }
    // print points 
    updatePoints(players);
    const seatZeroCards = players.find((player) => player.seat === 0).hand;
    const seatOneCards = players.find((player) => player.seat === 1).hand;
    // const seatTwoCards = players.find((player) => player.seat === 2).hand;          // commented out for easier testing with 2 players
    // const seatThreeCards = players.find((player) => player.seat === 3).hand;
    console.log({ seatZeroCards, seatOneCards });
    updateHand(playerOneHand, seatZeroCards,game_id);
    updateHand(playerTwoHand, seatOneCards,game_id);
    // updateHand(playerThreeHand, seatTwoCards, game_id);
    // updateHand(playerFourHand, seatThreeCards, game_id);
  }
};

passButton.addEventListener("click", (event) => {
  fetch(`${roomId}/passCards/`, {
      method: "post",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ selectedCards })
  })
})

export { configure };