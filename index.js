const config = require("./knexfile.js");
const knex = require("knex")(config.development);
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send({ msg: "Hello World" });
});
