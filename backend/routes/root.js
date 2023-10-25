const express = require("express");
const router = express.Router();

router.get("/", (request, response) => {
    const name = "APPLE";
    
    response.render("root", {name});
});

module.exports = router;