import { io } from "socket.io-client";
import { configure as gameSocketConfig } from "./game_socket";
import { configure as userSocketConfig } from "./user_socket";

const gameSocketId = document.querySelector("#game-socket-id").value;
const userSocketId = document.querySelector("#user-socket-id").value;

const gameSocket = io({ query: { gameSocketId } });
gameSocketConfig(gameSocketId);
userSocketConfig(userSocketId);
