const db = require("./connection");

const USER_EXISTENCE = "SELECT COUNT (*) FROM users WHERE username = $1";
const ADD_USER =
  "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *";
const SIGN_USER_IN =
  "SELECT * FROM users WHERE username = $1 and password = $2";
const username_exists = (username) => {
  try {
    return db.one(USER_EXISTENCE, [username]);
  } catch {
    return Promise.resolve(false);
  }
};
const create = (username, password) => {
  db.one(ADD_USER, [username, password]);
};
const sign_in = (username, password) => {
  db.one(SIGN_USER_IN, [username, password]);
};

module.exports = {
  username_exists,
  create,
  sign_in,
};
