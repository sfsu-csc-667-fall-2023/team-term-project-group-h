import { configure as gameSocketConfig } from "./game_socket";
import { configure as userSocketConfig } from "./user_socket";
import { ready } from "./ready";

const gameSocketId = document.querySelector("#game-socket-id").value;
const userSocketId = document.querySelector("#user-socket-id").value;

const gameSocket = await gameSocketConfig(gameSocketId);
const userSocket = await userSocketConfig(userSocketId);

ready(gameSocket, userSocket);