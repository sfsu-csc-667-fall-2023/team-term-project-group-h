import { io } from "socket.io-client";
import * as GAME_CONSTANTS from "@constants/games";

let gameSocket;
let selectedCards = [];

const roomId = document.querySelector("#roomId").value;
const playButton = document.querySelector("#play-button");
const passButton = document.querySelector("#pass-button");

const showPassButton = () => {
  document.getElementById("play-button").style.visibility="hidden";
  document.getElementById("pass-button").style.visibility="visible";
};

const showPlayButton = () => {
  document.getElementById("play-button").style.visibility="visible";
  document.getElementById("draw-button").style.visibility="hidden";
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

const updateHand = (handContainer, cardList) => {
  handContainer.innerHTML = "";

  cardList.forEach(({ suits, value, card_id, user_id }) => {
    console.log(card_id);
    const container = cardTemplate.content.cloneNode(true);
    const div = container.querySelector(".card");

    div.classList.add(`suit-${suits}`);
    div.classList.add(`value-${value}`);
    div.innerText = `${value}`;
    div.addEventListener("click", () => {
      selectedCards.push({ card_id, user_id });

      console.log(JSON.stringify(selectedCards));
    });

    handContainer.appendChild(div);
  });
};

const stateUpdated = ({ game_id, current_player, players }) => {
  const { turn_number } = current_player;

  if(players.length === 2) {
    if(turn_number === 0) {
      showPassButton();
    } else {
      showPlayButton();
    }

    const seatZeroCards = players.find((player) => player.seat === 0).hand;
    const seatOneCards = players.find((player) => player.seat === 1).hand;

    // const seatTwoCards = players.find((player) => player.seat === 2).hand;           commented out for easier testing with 2 players
    // const seatThreeCards = players.find((player) => player.seat === 3).hand;
    console.log({ seatZeroCards, seatOneCards });
    updateHand(playerOneHand, seatZeroCards);
    updateHand(playerTwoHand, seatOneCards);
    // updateHand(playerThreeHand, seatThreeCards);
    // updateHand(playerFourHand, seatFourCards);
  }
};

passButton.addEventListener("click", (event) => {
  fetch(`${roomId}/passCards/`, {
      method: "post",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ selectedCards })
  })

  document.querySelector("#chatInput").value = '';
})

export { configure };