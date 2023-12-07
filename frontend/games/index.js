import { configure as gameSocketConfig } from "./game_socket";
import { configure as userSocketConfig } from "./user_socket";

const gameSocketId = document.querySelector("#game-socket-id").value;
const userSocketId = document.querySelector("#user-socket-id").value;
const roomId = document.querySelector("#roomId").value;

gameSocketConfig(gameSocketId)
  .then((_) => userSocketConfig(userSocketId))
  .then((_) => {
    console.log("Fetching");
    fetch(`/game/${roomId}/ready`, { method: "post" });    //no ready endpoint yet, do we need? Can just start game when 4 players in room
});