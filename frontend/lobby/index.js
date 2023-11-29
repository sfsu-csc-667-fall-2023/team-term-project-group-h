import { io } from "socket.io-client";

const gameEntryTemplate = document.querySelector("#gameEntry");
const gameList = document.querySelector(".gameList ul");

const socket = io();

socket.on("game:created", ({ title, playerCount, timeElapsed, id }) => {
  const entry = gameEntryTemplate.content.cloneNode(true);
  const a = entry.querySelector("a");
  const div = entry.querySelector("div");
  const playersP = entry.querySelector(".players");
  const timeP = entry.querySelector(".time");

  a.href = `/games/${id}/join`;
  div.innerText = `${title} ${playerCount} ${timeElapsed}`;
  playersP.innerText = `${playerCount}/4`;
  timeP.innerText = `${timeElapsed}`;

  gameList.appendChild(entry);
});