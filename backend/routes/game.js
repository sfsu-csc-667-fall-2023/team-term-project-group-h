const crypto = require("crypto");
const express = require("express");
const router = express.Router();

const { Games, Users } = require("../db");

router.post("/create", async (request, response) => {
  const { title } = request.body;
  const { id: userId } = request.session.user;
  const io = request.app.get("io");

  const { id: gameId } = await Games.create(
    crypto.randomBytes(20).toString("hex"),
    title
  );
  await Games.addUser(userId, gameId);

  io.emit("game:created", { id: gameId });

  response.redirect(`/game/${gameId}`);
});

router.get("/:id/join", async (request, response) => {
  const { id: gameId } = request.params;
  const { id: userId, email: userEmail } = request.session.user;
  const io = request.app.get("io");

  await Games.addUser(userId, gameId);
  //TODO need to increment seats in game_users
  io.emit("game:user_added", { userId, userEmail, gameId });

  response.redirect(`/game/${gameId}`);
});

router.get("/:id", async (request, response) => {
  const { id } = request.params;
  const { game_socket_id: gameSocketId } = await Games.getGame(id);

  const { sid } = await Users.getUserSocket(request.session.user.id);
  console.log({ sid });

  // response.render("game", { id, gameSocketId });
  response.render("game", {
    id: request.params.id,
    title: `Game ${request.params.id}`,
    links: { lobby: { href: "/lobby", text: "Lobby" } },
    gameSocketId,
  });
});

module.exports = router;
