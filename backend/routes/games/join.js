const { Games } = require("../../db");

const method = "get";
const route = "/:id/join";

const handler = async (request, response) => {
    const { id: gameId } = request.params;
    const { id: userId } = request.session.user;

    const usersInGame = await Games.usersInGame(gameId);

    const userAlreadyInGame = usersInGame.some(
        (entry) => entry.user_id === userId)


    if(!userAlreadyInGame) {
        await Games.addUser(userId, gameId);
    }

    response.redirect(`/game/${gameId}`);
};

module.exports = { method, route, handler };