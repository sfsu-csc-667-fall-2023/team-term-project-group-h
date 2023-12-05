const express = require("express");
const router = express.Router();

router.get("/", (_request, response) => {
  response.render("waiting");
});

module.exports = router;
