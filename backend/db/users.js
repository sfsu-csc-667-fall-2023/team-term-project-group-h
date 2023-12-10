const database = require("./connection");
const { connection: db, pgp } = database;

const USER_EXISTENCE = "SELECT username FROM users WHERE username=$1";
const EMAIL_EXISTENCE = "SELECT email FROM users WHERE email=$1";
const ADD_USER =
  "INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING id, username";
const SIGN_USER_IN = "SELECT * FROM users WHERE username = $1";
const GET_USER_SOCKET =
  "SELECT sid FROM session WHERE sess->'user'->>'id'='$1' ORDER BY expire DESC LIMIT 1";
const GET_USER_ID = "SELECT id FROM users WHERE username = $1";

const username_exists = (username) =>
  db
    .one(USER_EXISTENCE, [username])
    .then((_) => true)
    .catch((_) => false);
const email_exists = (email) =>
  db
    .one(EMAIL_EXISTENCE, [email])
    .then((_) => true)
    .catch((_) => false);
const create = (email, username, password) => {
  return db.one(ADD_USER, [email, username, password]);
};
const find_by_username = (username) => {
  return db.one(SIGN_USER_IN, [username]);
};
const getUserSocket = (userId) => db.one(GET_USER_SOCKET, [userId]);

const getUserId = (username) => {
  return db.one(GET_USER_ID, [username]);
};

module.exports = {
  username_exists,
  create,
  find_by_username,
  email_exists,
  getUserSocket,
  getUserId,
};
