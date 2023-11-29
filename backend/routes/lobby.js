const express = require("express");
const { Games } = require("../db");
const router = express.Router();
const Games = require('../db');

router.get("/", (_request, response) => {
    // const gamesList = Games.getAvailableGames();

    // response.render("lobby", {gamesList});
    response.render("lobby");
});

module.exports = router;
