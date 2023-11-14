const db = require("./connection");

const USER_EXISTENCE = "SELECT COUNT (*) FROM users WHERE username = $1";
const ADD_USER =
  "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username";
const SIGN_USER_IN =
  "SELECT * FROM users WHERE username = $1";
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
const find_by_username = (username) => {
  return db.one(SIGN_USER_IN, [username]);
};

module.exports = {
  username_exists,
  create,
  find_by_username,
};
