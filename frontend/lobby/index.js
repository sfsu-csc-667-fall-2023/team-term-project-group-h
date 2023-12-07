import { io } from "socket.io-client";

const gameEntryTemplate = document.querySelector("#join-game-entry");
const gameList = document.querySelector(".gameList");
const socket = io();
const userId = parseInt(gameList.dataset.user)

socket.on("game:created", ({ id, title, createdBy }) => {
  const entry = gameEntryTemplate.content.cloneNode(true);
  const a = entry.querySelector("a");
  const div = entry.querySelector("div");

  div.childNodes[0].nodeValue = `${title}`;

  if (createdBy === userId) {
    a.href = `/game/${id}`;
    gameList.querySelector(".joined").appendChild(entry);
  } else {
    a.href = `/game/${id}/join`;
    gameList.querySelector(".available").appendChild(entry);
  }

  gameList.querySelector("ul").appendChild(entry);
});

const refresh = document.getElementById("refresh");

refresh.addEventListener("click", () => {
  location.reload();
});

