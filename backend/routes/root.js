const express = require("express");
const router = express.Router();

router.get("/", (request, response) => {
  const name = "APPLE";

  response.render("root", { name });
});

router.get("/login", (request, response) => {
  response.render("login");
});

router.post("/login/user", (request, response) => {
  const { username } = request.body;
  response.send("Username: " + username);
});

module.exports = router;
