const express = require("express");
const { Games } = require("../db");
const router = express.Router();

router.get("/", async (request, response) => {
  const availableGames = await Games.getAvailableGames();
  const playerCount = await Games.userCountAll();

  response.render("lobby", { availableGames, playerCount });
});

module.exports = router;
