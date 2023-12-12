import { io } from "socket.io-client";
import * as GAME_CONSTANTS from "@constants/games";

let gameSocket;

const roomId = document.querySelector("#roomId").value;
// const playButton = document.querySelector("#play-button");   TODO: make play button
const passButton = document.querySelector("#PassButton");
const playButton = document.querySelector("#PlayButton");

const cardTemplate = document.querySelector("#card");

const playerOneHand = document.querySelector(".player-one-hand");
const playerTwoHand = document.querySelector(".player-two-hand");
const playerThreeHand = document.querySelector(".player-three-hand");
const playerFourHand = document.querySelector(".player-four-hand");
const playerOneFloor = document.getElementById("player-one-floor");
const playerTwoFloor = document.getElementById("player-two-floor");
const playerThreeFloor = document.getElementById("player-three-floor");
const playerFourFloor = document.getElementById("player-four-floor");

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
  2: "hearts",
  3: "diamonds",
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

  console.log("Game socket configured");

  return Promise.resolve(gameSocket);
};

const updateHand = (
  handContainer,
  floorContainer,
  cardList,
  game_id,
  selectedCardsIndex,
  turn_number,
  current_player
) => {
  // console.log(`THIS IS USER ID ${userId}`);

  // console.log(`Updating hand for game ${game_id} in handContainer ${handContainer}`);

  handContainer.innerHTML = "";
  floorContainer.innerHTML = "";

  cardList.forEach(({ suits, value, card_id, user_id, card_order }) => {
    if (
      !mapSeatToHand[selectedCardsIndex].includes(card_id) &&
      card_order !== -1
    ) {
      mapSeatToHand[selectedCardsIndex].push(card_id);
    }

    mapUserIdToSeat[user_id] = selectedCardsIndex;

    console.log(`THIS IS THE NEW MAP-SEATS ${JSON.stringify(mapSeatToHand)}`);

    console.log(`THIS IS THE NEW MAP ${JSON.stringify(mapUserIdToSeat)}`);

    console.log(
      `value: ${value}, suits: ${suits}, card_id: ${card_id}, card_order: ${card_order},
       user_id: ${user_id}, selectedCardsIndex: ${selectedCardsIndex}`
    );
    console.log(
      `selectedCardsIndex: ${selectedCardsIndex}, this should be empty: selectedCards: ${selectedCards[selectedCardsIndex]}`
    );

    const container = cardTemplate.content.cloneNode(true);
    const div = container.querySelector(".card");

    div.classList.add(`suit-${suits}`);
    div.classList.add(`value-${value}`);

    div.innerText = `${value} of ${suitsMap[suits]}`;
    if (turn_number == 0) {
      div.addEventListener("click", () => {
        // opaque card if selected
        const userId = passButton.dataset.user;
        console.log(`USER ID ${userId} PRESSED CARD ${card_id}`);
        const seat = mapUserIdToSeat[userId];
        if (
          selectedCards[selectedCardsIndex].length < 3 &&
          mapSeatToHand[seat].includes(card_id)
        ) {
          if (selectedCards[selectedCardsIndex].includes(card_id)) {
            return;
          } else {
            div.classList.toggle("selected");
            selectedCards[selectedCardsIndex].push(card_id);
            console.log(
              `SELECTED CARDS OF THIS USER ${JSON.stringify(
                selectedCards[selectedCardsIndex]
              )}`
            );
          }
        }
      });
    } else {
      // this is for every other turn

      div.addEventListener("click", () => {
        // opaque card if selected
        const userId = playButton.dataset.user;
        console.log(`USER ID ${userId} PRESSED CARD ${card_id}`);
        const seat = mapUserIdToSeat[userId];
        if (
          selectedCards[selectedCardsIndex].length < 1 &&
          mapSeatToHand[seat].includes(card_id)
        ) {
          if (selectedCards[selectedCardsIndex].includes(card_id)) {
            return;
          } else {
            div.classList.toggle("selected");
            selectedCards[selectedCardsIndex].push(card_id);
            console.log(
              `SELECTED CARDS OF THIS USER ${JSON.stringify(
                selectedCards[selectedCardsIndex]
              )}`
            );
          }
        }
      });
    }

    if (card_order > 0) {
      handContainer.appendChild(div);
    } else {
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
      console.log(
        `Player ${player.seat} has ${player.game_points} game points, ${player.hand_points} hand points`
      );
    } else {
      console.error(`Element not found for seat ${player.seat}`);
    }
  });
};

const stateUpdated = ({ game_id, current_player, players, turn_number }) => {
  console.log(
    `STATE UPDATED: ${JSON.stringify({
      game_id,
      current_player,
      players,
      turn_number,
    })}`
  );

  if (players.length === 4) {
    if (turn_number % 52 === 0) {
      showPassButton();
      instructions.innerHTML = "Choose 3 cards to pass to the next player.";
    } else {
      showPlayButton();
      instructions.innerHTML = `Player ${turn_number % 4}'s turn!`; //TODO need current_player's username here
    }
    // print points
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

    // console.log({ seatZeroCards, seatOneCards });
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

    if (turn_number > 0) {
      // update Floor
    }
  }
};

passButton.addEventListener("click", () => {
  const userId = parseInt(passButton.dataset.user);
  console.log(`USER ID ${userId} PRESSED PASS BUTTON`);
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
  // clear selected cards
  selectedCards[mapUserIdToSeat[userId]] = [];
});

playButton.addEventListener("click", () => {
  const userId = parseInt(playButton.dataset.user);
  console.log(`USER ID ${userId} PRESSED PLAY BUTTON`);

  fetch(`${roomId}/play/`, {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cards: selectedCards[mapUserIdToSeat[userId]],
      userId: userId,
    }),
  });

  // clear selected cards
  selectedCards[mapUserIdToSeat[userId]] = [];
});

export { configure };
