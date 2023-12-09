const { Games, Users } = require("../../db");

const method = "get";
const route = "/:id";

const handler = async (request, response) => {
    const { id } = request.params;
  
    const { id: userId } = request.session.user;
    const { game_socket_id: gameSocketId } = await Games.getGame(id);
    
    const { sid: userSocketId } = await Users.getUserSocket(userId);
    let messages;
    try {
      messages = await Games.getMessages(id);
    } catch (error) {
      console.error("Error:", error);
    }
    
    response.render("game", {
      id: request.params.id,
      title: `Game ${request.params.id}`,
      links: { lobby: { href: "/lobby", text: "Lobby" } },
      gameSocketId,
      userSocketId,
      messages,
    });
};

module.exports = { method, route, handler };