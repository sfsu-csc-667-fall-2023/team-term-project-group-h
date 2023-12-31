import { io } from "socket.io-client";
import * as GAME_CONSTANTS from "@constants/games";

let gameSocket;

const roomId = document.querySelector("#roomId").value;

const passButton = document.querySelector("#PassButton");
const playButton = document.querySelector("#PlayButton");

const userId = parseInt(passButton.dataset.user);

const cardTemplate = document.querySelector("#card");

const playerOneHand = document.querySelector(".player-one-hand");
const playerTwoHand = document.querySelector(".player-two-hand");
const playerThreeHand = document.querySelector(".player-three-hand");
const playerFourHand = document.querySelector(".player-four-hand");
const playerOneFloor = document.getElementById("player-one-floor");
const playerTwoFloor = document.getElementById("player-two-floor");
const playerThreeFloor = document.getElementById("player-three-floor");
const playerFourFloor = document.getElementById("player-four-floor");
const userSocketId = document.querySelector("#user-socket-id").value;

const instructions = document.querySelector("#instructions");

const mapUserIdToSeat = {};
const mapSeatToHand = {
  0: [],
  1: [],
  2: [],
  3: [],
};

const selectedCards = [[], [], [], []];
const suitsMap = {
  0: "spades",
  1: "clubs",
  2: "diamonds",
  3: "hearts",
};

const showPassButton = () => {
  passButton.style.display = "inline";
  playButton.style.display = "none";
};

const showPlayButton = () => {
  passButton.style.display = "none";
  playButton.style.display = "inline";
};

const configure = (socketId) => {
  gameSocket = io({ query: { id: socketId } });

  gameSocket.on(GAME_CONSTANTS.STATE_UPDATED, stateUpdated);

  gameSocket.on(GAME_CONSTANTS.INVALID_PLAY, displayWarning);

  gameSocket.on(GAME_CONSTANTS.END_GAME, endGame);

  return Promise.resolve(gameSocket);
};

const updateHand = (
  handContainer,
  floorContainer,
  cardList,
  game_id,
  seatIndex,
  turn_number,
  current_player
) => {
  handContainer.innerHTML = "";
  floorContainer.innerHTML = "";

  mapSeatToHand[seatIndex] = [];

  cardList.forEach(({ suits, value, card_id, user_id, card_order }) => {
    if (
      !mapSeatToHand[seatIndex].includes(card_id) &&
      card_order !== -1
    ) {
      mapSeatToHand[seatIndex].push(card_id);
    }

    mapUserIdToSeat[user_id] = seatIndex;

    const container = cardTemplate.content.cloneNode(true);
    const div = container.querySelector(".card");
    
    if(userId === user_id || card_order === 0) {
      div.classList.add(`suit-${suits}`);
      div.classList.add(`value-${value}`);
    } else {
      div.classList.add("hiddencard");
    }

    if (turn_number == 0) {
      div.addEventListener("click", () => {
        const seat = mapUserIdToSeat[userId];

        if(selectedCards[seatIndex].includes(card_id)) {
          const index = selectedCards[seatIndex].indexOf(card_id);

          if(index > -1){
            selectedCards[seatIndex].splice(index, 1);
          }

          div.classList.remove("selected");
          return;
        }
        if(
          selectedCards[seatIndex].length < 3 &&
          mapSeatToHand[seat].includes(card_id)
        ) {
            div.classList.toggle("selected");
            selectedCards[seatIndex].push(card_id);
        }
      });
    } else if(card_order !== 0){
      div.addEventListener("click", () => {
        const seat = mapUserIdToSeat[userId];

        if(
          selectedCards[seatIndex].length == 1 &&
          mapSeatToHand[seat].includes(card_id)
        ) {
          const index = selectedCards[seatIndex].indexOf(card_id);

          if(index > -1){
            selectedCards[seatIndex].splice(index, 1);
          }
          div.classList.remove("selected");
          return;
        }

        if(
          selectedCards[seatIndex].length < 1 &&
          mapSeatToHand[seat].includes(card_id)
        ) {
          if(selectedCards[seatIndex].includes(card_id)) {
            return;
          }else {
            div.classList.toggle("selected");
            selectedCards[seatIndex].push(card_id);
          }
        }
      });
    }

    if(card_order > 0) {
      handContainer.appendChild(div);
    } else if(card_order === 0){
      floorContainer.appendChild(div);
    }
  });
};

const updatePoints = (players) => {
  players.forEach((player) => {
    const playerPoints = document.getElementById(
      `player-${player.seat + 1}-points`
    );

    if (playerPoints) {
      playerPoints.innerText = `USER: ${player.username}, POINTS: ${player.hand_points} `;
    } else {
      console.error(`Element not found for seat ${player.seat}`);
    }
  });
};

const stateUpdated = ({ game_id, current_player, players, turn_number, currentUsername }) => {
  if (players.length === 4) {
    if (turn_number === 0) {
      showPassButton();
      instructions.innerHTML = "Choose 3 cards to pass to the next player.";
    }else {
      showPlayButton();
      instructions.innerHTML = `${currentUsername}'s turn!`;
    }

    updatePoints(players);
    const seatZeroCards = players
      .find((player) => player.seat === 0)
      .hand.sort((a, b) => a.card_id - b.card_id);
    const seatOneCards = players
      .find((player) => player.seat === 1)
      .hand.sort((a, b) => a.card_id - b.card_id);
    const seatTwoCards = players
      .find((player) => player.seat === 2)
      .hand.sort((a, b) => a.card_id - b.card_id);
    const seatThreeCards = players
      .find((player) => player.seat === 3)
      .hand.sort((a, b) => a.card_id - b.card_id);

    updateHand(
      playerOneHand,
      playerOneFloor,
      seatZeroCards,
      game_id,
      0,
      turn_number,
      current_player
    );
    updateHand(
      playerTwoHand,
      playerTwoFloor,
      seatOneCards,
      game_id,
      1,
      turn_number,
      current_player
    );
    updateHand(
      playerThreeHand,
      playerThreeFloor,
      seatTwoCards,
      game_id,
      2,
      turn_number,
      current_player
    );
    updateHand(
      playerFourHand,
      playerFourFloor,
      seatThreeCards,
      game_id,
      3,
      turn_number,
      current_player
    );
  }
};

const displayWarning = (message) => {
  instructions.innerHTML = message;
};

const endGame = (winMessage) => {
  instructions.innerHTML = winMessage;
};

passButton.addEventListener("click", () => {
  if(selectedCards[mapUserIdToSeat[userId]].length !== 3) {
    instructions.innerHTML = "Please select 3 cards to pass.";

    return;
  } 

  instructions.innerHTML = "Waiting on other players to pass cards...";
  passButton.style.display = "none";

  fetch(`${roomId}/passCards/`, {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cards: selectedCards[mapUserIdToSeat[userId]],
      userId: userId,
    }),
  });
  
  selectedCards[mapUserIdToSeat[userId]] = [];
});

playButton.addEventListener("click", () => {
  fetch(`${roomId}/play/`, {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cards: selectedCards[mapUserIdToSeat[userId]],
      userId: userId,
      userSocketId
    }),
  });

  const cards = document.querySelectorAll(".selected");
  cards.forEach((card) => {
    card.classList.remove("selected");
  });
  
  selectedCards[mapUserIdToSeat[userId]] = [];
});

export { configure };
