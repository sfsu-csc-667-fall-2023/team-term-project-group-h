import { configure as gameSocketConfig } from "./game_socket";
import { configure as userSocketConfig } from "./user_socket";
import { ready } from "./ready"



const gameSocket = await gameSocketConfig()
const userSocket = await userSocketConfig()

ready(gameSocket, userSocket);