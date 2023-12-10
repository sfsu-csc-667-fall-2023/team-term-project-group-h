const express = require("express");
const router = express.Router();
const { Chat, Users } = require("../db");

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

  io.emit(`chat:message:${id === undefined ? 0 : id}`, {
    from: username,
    timestamp: Date.now(),
    message,
  });

  response.status(200).send();
};

router.post("/chat", handler);
router.post("/:id/chat", handler);

module.exports = router;
