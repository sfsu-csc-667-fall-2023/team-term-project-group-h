const express = require("express");
const router = express.Router();
const db = require("../../db/connection");

// Function to check if the table exists
async function tableExists() {
  try {
    await db.any(`SELECT 1 FROM test_table LIMIT 1`);
    return true; // Table exists
  } catch (error) {
    return false; // Table does not exist
  }
}

router.get("/", async (_request, response) => {
  const tableIsCreated = await tableExists();

  // Create the table if it doesn't exist
  if (!tableIsCreated) {
    try {
      await db.none(`
        CREATE TABLE test_table (
          id serial PRIMARY KEY,
          test_string text
        )
      `);
      console.log("Table 'test_table' created.");
    } catch (error) {
      console.error("Error creating the table:", error);
      response.json({ error: "Failed to create the table." });
      return;
    }
  }

  // Insert data into the table
  db.any(`INSERT INTO test_table ("test_string") VALUES ($1)`, [
    `Hello on ${new Date().toLocaleDateString("en-us", {
      hour: "numeric",
      minute: "numeric",
      month: "short",
      day: "numeric",
      weekday: "long",
      year: "numeric",
    })}`,
  ])
    .then((_) => db.any(`SELECT * FROM test_table`))
    .then((results) => response.json(results))
    .catch((error) => {
      console.log(error);
      response.json({ error });
    });
});

module.exports = router;
