const express = require("express");
const router = express.Router();

router.get("/:id", (request, response) => {
  
  response.render("game", { id: request.params.id, title: `Game ${request.params.id}`, links: { lobby: { href: "/lobby", text: "Lobby" }}});
});

module.exports = router;