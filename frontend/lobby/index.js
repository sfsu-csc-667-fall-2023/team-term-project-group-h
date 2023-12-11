import { io } from "socket.io-client";

// const gameEntryTemplate = document.querySelector("#join-game-entry");
const gameList = document.querySelector("#gameList");
const socket = io();
const userId = parseInt(gameList.dataset.user);

socket.on("game:created", ({ id, title, createdBy }) => {

  let tbody;
  console.log(`createdBy: ${createdBy} userId: ${userId}`);
  if (createdBy == userId) {
    tbody = document.querySelector("#joinedTableBody");
  } else {
    tbody = document.querySelector("#availableTableBody");
  }

  
  const th = document.createElement("th");
  th.setAttribute("scope", "row");
  th.innerHTML = `${id}`;
  const td1 = document.createElement("td");
  const a = document.createElement("a");
  a.setAttribute("href", `/game/${id}/join`);
  a.setAttribute(
    "class",
    "text-decoration-none text-reset btn btn-secondary w-100 p-3 "
  );
  a.innerHTML = `${title}`;
  td1.appendChild(a);
  const td2 = document.createElement("td");
  td2.innerHTML = "1";
  const td3 = document.createElement("td");
  td3.innerHTML = "False";
  const td4 = document.createElement("td");
  td4.innerHTML = "Now";
  const tr = document.createElement("tr");
  tr.appendChild(th);
  tr.appendChild(td1);
  tr.appendChild(td2);
  tr.appendChild(td3);
  tr.appendChild(td4);
  tbody.appendChild(tr);

});

// const refresh = document.getElementById("refresh");

// refresh.addEventListener("click", () => {
//   location.reload();
// });
