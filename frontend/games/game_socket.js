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

const updateHand = (handContainer, cardList) => {
  handContainer.innerHTML = "";

  cardList.forEach(({ suits, value }) => {
    const container = cardTemplate.content.cloneNode(true);
    const div = container.querySelector(".card");

    div.classList.add(`suit-${suits}`);
    div.classList.add(`value-${value}`);
    div.innerText = `${value}`;
    div.addEventListener("click", () => {
      fetch(`/game/${roomId}/ready`, { method: "post", body: {
          "suit": suits,
          "value": value
        }
      })
    });

    handContainer.appendChild(div);
  });
};

const stateUpdated = ({ game_id, current_player, players }) => {
  console.log("In stateUpdated");
  const seatZeroCards = players.find((player) => player.seat === 0).hand;
  const seatOneCards = players.find((player) => player.seat === 1).hand;
  // const seatTwoCards = players.find((player) => player.seat === 2).hand;           commented out for easier testing with 2 players
  // const seatThreeCards = players.find((player) => player.seat === 3).hand;

  console.log({ seatZeroCards, seatOneCards });
  updateHand(playerOneHand, seatZeroCards, );
  updateHand(playerTwoHand, seatOneCards);
  // updateHand(playerThreeHand, seatThreeCards);
  // updateHand(playerFourHand, seatFourCards);
};

export { configure };