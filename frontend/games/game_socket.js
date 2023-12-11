import { io } from "socket.io-client";
import * as GAME_CONSTANTS from "@constants/games";

let gameSocket;

const roomId = document.querySelector("#roomId").value;
// const playButton = document.querySelector("#play-button");   TODO: make play button
const passButton = document.querySelector("#PassButton");

const mapUserIdToSeat = {};

const mapSeatToHand = {
  0: [],
  1: [],
  2: [],
  3: [],
};
const selectedCards = [
  [],[],[],[]
];
const suitsMap = {
  0: "spades",
  1: "clubs",
  2: "hearts",
  3: "diamonds",
};
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

const updateHand = (handContainer, cardList, game_id, selectedCardsIndex) => {

  // console.log(`THIS IS USER ID ${userId}`);

  // console.log(`Updating hand for game ${game_id} in handContainer ${handContainer}`);

  handContainer.innerHTML = "";
  

  cardList.forEach(({ suits, value, card_id, user_id }) => {
    if(!mapSeatToHand[selectedCardsIndex].includes(card_id)) {
      mapSeatToHand[selectedCardsIndex].push(card_id);
    }

    mapUserIdToSeat[user_id] = selectedCardsIndex;

    console.log(`THIS IS THE NEW MAP-SEATS ${JSON.stringify(mapSeatToHand)}`);

    console.log(`THIS IS THE NEW MAP ${JSON.stringify(mapUserIdToSeat)}`);

    console.log(`value: ${value}, suits: ${suits}, card_id: ${card_id}, user_id: ${user_id}, selectedCardsIndex: ${selectedCardsIndex}`);
    console.log(`selectedCardsIndex: ${selectedCardsIndex}, selectedCards: ${selectedCards[selectedCardsIndex]}`);

    const container = cardTemplate.content.cloneNode(true);
    const div = container.querySelector(".card");

    div.classList.add(`suit-${suits}`);
    div.classList.add(`value-${value}`);
    
    div.innerText = `${value} of ${suitsMap[suits]}`;
    div.addEventListener("click", () => {


      // opaque card if selected
      const userId = passButton.dataset.user;
      console.log(`USER ID ${userId} PRESSED CARD ${card_id}`);
      const seat = mapUserIdToSeat[userId];
      if(selectedCards[selectedCardsIndex].length < 3 && mapSeatToHand[seat].includes(card_id)) {
        if(selectedCards[selectedCardsIndex].includes(card_id)){
          return
        } else {
          div.classList.toggle("selected");
          selectedCards[selectedCardsIndex].push(card_id);
          console.log(`SELECTED CARDS OF THIS USER ${JSON.stringify(selectedCards[selectedCardsIndex])}`);
        }
      }
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

const stateUpdated = ({ game_id, current_player, players, turn_number }) => {
  
  
  if(players.length === 4) {
    if(turn_number === 0) {
      showPassButton();
    } else {
      showPlayButton();
    }
    // print points 
    updatePoints(players);
    const seatZeroCards = players.find((player) => player.seat === 0).hand;
    const seatOneCards = players.find((player) => player.seat === 1).hand;

    const seatTwoCards = players.find((player) => player.seat === 2).hand;          // commented out for easier testing with 2 players
    const seatThreeCards = players.find((player) => player.seat === 3).hand;
    // console.log({ seatZeroCards, seatOneCards });
    updateHand(playerOneHand, seatZeroCards, game_id, 0);
    updateHand(playerTwoHand, seatOneCards, game_id, 1);
    updateHand(playerThreeHand, seatTwoCards, game_id,2);
    updateHand(playerFourHand, seatThreeCards, game_id,3);
  }
};

passButton.addEventListener("click", () => {

  const userId = parseInt(passButton.dataset.user);
  console.log(`USER ID ${userId} PRESSED PASS BUTTON`);

  fetch(`${roomId}/passCards/`, {
      method: "post",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        cards: selectedCards[mapUserIdToSeat[userId]],
        userId: userId,
      }),
  });
})

export { configure };