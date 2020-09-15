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

app.get("/users/:id/events", async (req, res) => {
  try {
    res.send(await knex("events").select().where({ userId: req.params.id }));
  } catch (error) {
    console.error(error);
  }
});

app.get("/users/:id/tasks", async (req, res) => {
  try {
    res.send(await knex("tasks").select().where({ userId: req.params.id }));
  } catch (error) {
    console.error(error);
  }
});

app.post("/users/:id/events", async (req, res) => {
  try {
    const [id] = await knex("events").insert(req.body);
    const event = await knex("events").select().where({ id });
    res.status(201).send(event);
  } catch (error) {
    console.error(error);
    res.sendStatus(400);
  }
});

async function main() {
  await knex.migrate.latest();
  app.listen(PORT, () =>
    console.log(`Server started listening on http://localhost:${PORT}`)
  );
}

main();
