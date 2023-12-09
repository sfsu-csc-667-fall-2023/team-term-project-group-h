const express = require("express");
const router = express.Router();
const { Chat, Users } = require("../db");
// const { createHash } = require("crypto");

const handler = (request, response) => {
  const { id } = request.params;
  const { message } = request.body;
  const { username } = request.session.user;

  Users.getUserId(username)
    .then((user_id) => {
      user_id = user_id.id;

      Chat.add_message(user_id, id === undefined ? 0 : id, message);
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  const io = request.app.get("io");

  console.log("chat.js: ", { id, message, username });
  // this is the event that the client is listening for
  io.emit(`chat:message:${id === undefined ? 0 : id}`, {
    // hash: createHash("sha256").update(email).digest("hex"),
    from: username,
    timestamp: Date.now(),
    message,
  });

  response.status(200).send();
};

router.post("/chat", handler);
router.post("/:id/chat", handler);

module.exports = router;
