import { io } from "socket.io-client";

const gameEntryTemplate = document.querySelector("#join-game-entry");
const gameList = document.querySelector(".game-list");

const socket = io();
//sockets not working with games list in lobby
socket.on("game:created", ({ id }) => {
  const entry = gameEntryTemplate.content.cloneNode(true);
  const a = entry.querySelector("a");

  a.href = `/game/${id}/join`;
  a.innerText = `Join ${id}`;

  gameList.appendChild(entry);
});
