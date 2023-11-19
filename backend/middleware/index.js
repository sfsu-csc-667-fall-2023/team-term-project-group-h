const { isAuthenticated } = require("./is-authenticated.js");
const { requestTime } = require("./request-time");
const { sessionLocals } = require("./session-locals");
const { viewSessionData } = require("./view-session");

module.exports = {
  isAuthenticated,
  requestTime,
  sessionLocals,
  viewSessionData,
};