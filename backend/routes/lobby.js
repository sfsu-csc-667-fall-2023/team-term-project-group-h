const express = require("express");
const { Games, Chat } = require("../db");
const router = express.Router();

router.get("/", async (request, response) => {
  const { id } = request.session.user;
  const availableGames = await Games.getAvailableGames(id);
  const currentGames  = await Games.currentGamesForUser(id);
  const messages = await Chat.get_messages(0);
  console.log("messages: ", messages);
  response.render("lobby", { availableGames, currentGames, messages});
});

module.exports = router;