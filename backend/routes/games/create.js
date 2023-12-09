const crypto = require("crypto");

const { Games } = require("../../db");
const GAME_CONSTANTS = require("../../../constants/games");

const method = "post";
const route = "/create";

const handler = async (request, response) => {
  const { title } = request.body;
  const { id: userId } = request.session.user;
  const io = request.app.get("io");

  const { id: gameId } = await Games.create(
    crypto.randomBytes(20).toString("hex"),
    title
  );
  await Games.addUser(userId, gameId);
    
  io.emit(GAME_CONSTANTS.CREATED, { id: gameId, title, createdBy: userId });

  response.redirect(`/game/${gameId}`);
};

module.exports = { method, route, handler };