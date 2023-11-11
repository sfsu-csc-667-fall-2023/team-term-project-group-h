const express = require("express");
const router = express.Router();

router.get("/", (request, response) => {
  response.render("login");
});

router.post("/user", (request, response) => {
  const { username } = request.body;
  response.send("Username: " + username);
});

module.exports = router;
