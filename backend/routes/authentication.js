const express = require("express");
const router = express.Router();
const { Users } = require("../db");
const bcrypt = require("bcrypt");
const SALT_ROUND = 10;

router.get("/", (request, response) => {
  response.render("login",{ links: { lobby: { href: "/lobby", text: "Lobby" } }});
});

router.post("/", async (request, response) => {
  const { username, password } = request.body;

  try{
    const user = await Users.find_by_username(username);
    const isValidUser = await bcrypt.compare(password, user.password);
    if(isValidUser){
      request.session.user = {
        id: user.id,
        username,
      };

      response.redirect("/lobby");
      return;
    } else {
      response.redirect("/login");
    }
  } catch (error) {
    console.log(error);
    response.redirect("/login");
  }
});

router.post("/sign_up", async (request, response) => {
  const { email, username, password } = request.body;
  
  const user_exists = await Users.username_exists(username);
  const email_exists = await Users.email_exists(email);

  if (user_exists || email_exists) {
    response.redirect("/login");
    return;
  }

  const salt = await bcrypt.genSalt(SALT_ROUND);
  const hash = await bcrypt.hash(password, salt);
  const user = await Users.create(email, username, hash);

  request.session.user = {
    id: user.id,
    username,
  };

  response.redirect("/lobby");
});

router.get("/logout", (request, response) => {
  request.session.destroy();

  response.redirect("/login");
});

module.exports = router;
