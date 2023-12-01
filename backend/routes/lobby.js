const express = require("express");
const { Games } = require("../db");
const router = express.Router();

router.get("/", async (request, response) => {
  const availableGames = await Games.getAvailableGames();

  response.render("lobby", { availableGames });
});

module.exports = router;
