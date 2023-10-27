const express = require("express");
const router = express.Router();
router.get("/", (_request, response) => {
  const name = "this is passed from route root.js";
  response.render('root', { name });
});


module.exports = router;