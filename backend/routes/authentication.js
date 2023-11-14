const express = require("express");
const router = express.Router();
const { Users } = require("../db");
const bcrypt = require("bcrypt");
const SALT_ROUND = 10;

//Login Page
router.get("/", (request, response) => {
  response.render("login");
});

//Login Post
router.post("/", (request, response) => {
  const { username, password } = request.body;
  response.send(
    "Login Page \n Username: " + username + " Password: " + password,
  );
});

//Signup route
router.post("/sign_up", async (request, response) => {
  const { username, password } = request.body;
  const user_exists = await User.username_exists(username);

  // First Check if they exist and redirect to login.
  if (user_exists) {
    response.redirect("/login");
    return;
  }
  // Encrypt the clear text password
  const salt = await bcrypt.genSalt(SALT_ROUND);
  const hash = await bcrypt.hash(password, salt);

  //Store in the DB
  const { id } = Users.create(username, hash);

  //Store in session

  //Redirect lobby
  response.redirect("/lobby");
});

module.exports = router;
