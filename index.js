const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// creating an Express instance
const app = express();
const PORT = process.env.PORT || 3000;

// initializing a basic API that
// returns the "Hello, World!" message
app.get("/", (req, res) => {
  res.json("Hello, World!");
});

// running the server
app.listen(PORT, () => {
  console.log(`Starting Express server on http://localhost:${PORT}`);
});
