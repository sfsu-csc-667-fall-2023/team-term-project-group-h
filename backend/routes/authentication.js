const express = require("express");
const router = express.Router();

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
router.post("/signup", (request, response) => {
  const { username } = request.body;
  response.send("Registered Page \n Username: " + username);
});

module.exports = router;
