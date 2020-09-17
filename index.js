const config = require("./knexfile.js");
const knex = require("knex")(config.development);
const express = require("express");
const bodyParser = require("body-parser");
const jsonWebToken = require("jsonwebtoken");
const cors = require("cors");
const { hashPassword, checkPassword, ApiError } = require("./utilities");

const { request, response } = require("express");

const app = express();

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "my-secret";

app.use(cors());
app.use(bodyParser.json());

const authMiddleware = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    const token = header.slice(header.indexOf(" ") + 1);
    const payload = jsonWebToken.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    throw new ApiError("Invalid JWT", 401);
  }
};

app.get("/", (req, res) => {
  res.sendStatus(200);
});

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  if (
    !email ||
    !password ||
    password.length < 5 ||
    !/\w+@\w+\.\w{2,}/.test(email)
  ) {
    throw new ApiError("Missing email/password", 400);
  }
  const hashedPassword = await hashPassword(password);
  const [id] = await knex("users").insert({ email, hashedPassword });
  const user = { email, id };
  const jwt = jsonWebToken.sign(user, JWT_SECRET);
  res.send({ user, jwt });
});

app.post("/signin", async (req, res) => {
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

app.post("/events", authMiddleware, async (req, res) => {
  try {
    const eventData = { ...req.body, userId: req.user.id };
    const [id] = await knex("events").insert(eventData);
    const event = await knex("events")
      .select("name", "date", "location", "description")
      .where({ id });
    res.send(event);
  } catch (error) {
    res.sendStatus(400);
  }
});

app.post("/tasks", authMiddleware, async (req, res) => {
  try {
    const taskData = { ...req.body, userId: req.user.id };
    const [id] = await knex("tasks").insert(taskData);
    const task = await knex("tasks")
      .select("task", "deadline", "notes")
      .where({ id });
    res.send(task);
  } catch (error) {
    res.sendStatus(400);
  }
});

app.get("/events", authMiddleware, async (req, res) => {
  try {
    res.send(
      await knex("events")
        .select("name", "date", "location", "description", "attending")
        .where({ userId: req.user.id })
    );
  } catch (error) {
    console.error(error);
  }
});

app.get("/tasks", authMiddleware, async (req, res) => {
  try {
    res.send(
      await knex("tasks")
        .select("task", "deadline", "notes", "completed")
        .where({ userId: req.user.id })
    );
  } catch (error) {
    console.error(error);
  }
});

app.use((error, req, res, next) => {
  console.error(`[ERROR] ${error}`);
  if (error instanceof ApiError) {
    res.status(error.status).send({
      error: error.message,
    });
  } else {
    res.status(400).send({ error: String(error) });
  }
});

async function main() {
  await knex.migrate.latest();
  app.listen(PORT, () =>
    console.log(`Server started listening on http://localhost:${PORT}`)
  );
}

main();
