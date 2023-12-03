const database = require("./connection");
const { connection: db, pgp } = database;
const Users = require("./users");

const CREATE = "INSERT INTO games (game_socket_id, title) VALUES ($1, $2) RETURNING id";
const ADD_USER = "INSERT INTO game_users (user_id, game_id, seat) VALUES ($1, $2, $3)";
const GET_GAME = "SELECT * FROM games WHERE id=$1";
const GET_AVAILABLE_GAMES = "SELECT * FROM games";
const GET_USER_COUNT = "SELECT COUNT(*) FROM game_users WHERE game_id=$1";

const create = (gameSocketId, title) => db.one(CREATE, [gameSocketId, title]);

const addUser = (userId, gameId) =>
  userCount(gameId).then((playerCount) =>
    db.none(ADD_USER, [userId, gameId, playerCount]),
  );

const getGame = (gameId) => db.one(GET_GAME, gameId);

const getAvailableGames = () => db.any(GET_AVAILABLE_GAMES);

const userCount = (gameId) => db.one(GET_USER_COUNT, [gameId])
  .then(({ count }) => parseInt(count));

const SHUFFLE = "SELECT *, random() AS rand FROM cards ORDER BY rand";
const SET_CURRENT_PLAYER = "UPDATE games SET turn_number=0 WHERE id=$2";
const GET_PLAYER_BY_SEAT =
  "SELECT user_id FROM game_users WHERE seat=$1 AND game_id=$2";
const GET_CARDS =
  "SELECT card_id FROM game_cards WHERE game_id=$1 AND user_id=0 ORDER BY card_order LIMIT $2";
const GET_USERS = "SELECT user_id FROM game_users WHERE game_id=$1";
const DEAL_CARD =
  "UPDATE game_cards SET user_id=$1 WHERE game_id=$2 AND card_id=$3";


const initialize = async (gameId) => {
  const shuffledDeck = await db.many(SHUFFLE);
  const columns = new pgp.helpers.ColumnSet(
    ["user_id", "game_id", "card_id", "card_order"],
    { table: "game_cards" },
  );
  const values = shuffledDeck.map(({ id }, index) => ({
    user_id: 0,
    game_id: gameId,
    card_id: id,
    card_order: index,
  }));

  const query = pgp.helpers.insert(values, columns);
  await db.none(query);

  const { user_id: firstPlayer } = await db.one(GET_PLAYER_BY_SEAT, [
    0,
    gameId,
  ]);
  await db.none(SET_CURRENT_PLAYER, [firstPlayer, gameId]);

  // const users = db.many(GET_USERS, [gameId]);
  // const cards = db.many(GET_CARDS, [gameId, 4]);
  // await Promise.all()


}

module.exports = {
  create,
  addUser,
  getGame,
  getAvailableGames,
  userCount,
  initialize
};
