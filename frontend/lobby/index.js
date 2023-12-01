import { io } from "socket.io-client";

const gameEntryTemplate = document.querySelector("#join-game-entry");
const gameList = document.querySelector(".gameList");

const socket = io();
socket.on("game:created", ({ id, title }) => {
  const entry = gameEntryTemplate.content.cloneNode(true);
  const a = entry.querySelector("a");
  const div = entry.querySelector("div");
  const players = entry.querySelector(".players");
  const time = entry.querySelector(".time");

  a.href = `/game/${id}/join`;
  div.childNodes[0].nodeValue = `${title}`;
  players.innerText = "1/4";
  time.innerText = "00:00";

  gameList.querySelector("ul").appendChild(entry);
});




