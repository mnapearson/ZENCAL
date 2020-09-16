const config = require("./knexfile.js");
const knex = require("knex")(config.development);
const express = require("express");
const bodyParser = require("body-parser");
const jsonWebToken = require("jsonwebtoken");
const cors = require("cors");
const { hashPassword, checkPassword, ApiError } = require("./utilities");
const { response, request } = require("express");
const app = express();

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "my-secret";

app.use(cors());
app.use(bodyParser.json());

const authMiddleware = (req, res, next) => {
  try {
    const header = request.headers.authorization;
    const token = header.slice(header.indexOf(" ") + 1);
    const payload = jsonWebToken.verify(token, JWT_SECRET);
    request.user = payload;
    next();
  } catch (error) {
    throw new ApiError("Invalid JWT", 401);
  }
};

app.get("/", (req, res) => {
  res.sendStatus(200);
});

app.post("/auth/signup", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password || password.length < 5) {
    throw new Error("Missing email/password/username");
  }
  const hashedPassword = await hashPassword(password);
  const [id] = await knex("users").insert({ email, hashedPassword });
  const user = { email, id };
  const jwt = jsonWebToken.sign(user, JWT_SECRET);
  res.send({ user, jwt });
});

app.post("/auth/signin", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError("Missing email/password", 400);
  }
  const [dbUser] = await knex("users").select().where({ email });
  if (dbUser == undefined) {
    throw new ApiError("Invalid Credentials", 401);
  }
  const passwordCorrect = await checkPassword(password, dbUser.hashedPassword);
  if (passwordCorrect == false) {
    throw new ApiError("Invalid Credentials", 401);
  }

  const user = { email, id: dbUser.id };
  const jwt = jsonWebToken.sign(user, JWT_SECRET);
  res.send({ user, jwt });
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

app.post("/users/:id/tasks", async (req, res) => {
  try {
    const [id] = await knex("tasks").insert(req.body);
    const task = await knex("tasks").select().where({ id });
    res.status(201).send(task);
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
