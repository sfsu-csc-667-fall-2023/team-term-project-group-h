const crypto = require("crypto");
const express = require("express");
const router = express.Router();

const { Games, Users } = require("../db");
const GAME_CONSTANTS = require("../../constants/games");

router.post("/create", async (request, response) => {
  const { title } = request.body;
  const { id: userId } = request.session.user;
  const io = request.app.get("io");

  const { id: gameId } = await Games.create(
    crypto.randomBytes(20).toString("hex"),
    title
  );
  await Games.addUser(userId, gameId);
    
  io.emit(GAME_CONSTANTS.CREATED, { id: gameId, title });

  response.redirect(`/game/${gameId}`);
});

router.post("/:id/test", async (request, response) => {
  const { id: gameId } = request.params;
  const { id: userId } = request.session.user;
  const { sid: userSocketId } = await Users.getUserSocket(userId);
  const { game_socket_id: gameSocketId } = await Games.getGame(gameId);

  const io = request.app.get("io");

  io.to(userSocketId).emit("game:test", { source: "User", gameId, userId, userSocketId, gameSocketId });
  io.to(gameSocketId).emit("game:test", { source: "Game", gameId, userId, userSocketId, gameSocketId });

  response.status(200).send();
})

router.get("/:id/join", async (request, response) => {
  const { id: gameId } = request.params;
  const { id: userId, email: userEmail } = request.session.user;
  const io = request.app.get("io");

  await Games.addUser(userId, gameId);
  //TODO need to increment seats in game_users
  io.emit(GAME_CONSTANTS.USER_ADDED, { userId, userEmail, gameId });

  const userCount = await Games.userCount(gameId)
  console.log({ userCount });

  if(userCount === 4) {
    const gameState = await Games.initialize(gameId);
    io.emit(GAME_CONSTANTS.START, gameState);
  }

  response.redirect(`/game/${gameId}`);
});

router.get("/:id", async (request, response) => {
  const { id } = request.params;

  const { id: userId } = request.session.user;
  const { game_socket_id: gameSocketId } = await Games.getGame(id);
  const { sid: userSocketId } = await Users.getUserSocket(userId);

  response.render("game", {
    id: request.params.id,
    title: `Game ${request.params.id}`,
    links: { lobby: { href: "/lobby", text: "Lobby" } },
    gameSocketId,
    userSocketId
  });
});

module.exports = router;
