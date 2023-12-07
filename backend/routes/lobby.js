const express = require("express");
const { Games } = require("../db");
const router = express.Router();

router.get("/", async (request, response) => {
  const { id } = request.session.user;
  const availableGames = await Games.getAvailableGames(id);
  const currentGames  = await Games.currentGamesForUser(id);
  response.render("lobby", { availableGames, currentGames});
});

module.exports = router;