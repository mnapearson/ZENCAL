exports.seed = async function (knex) {
  await knex("users").del();
  await knex("events").del();
  await knex("tasks").del();

  await knex("users").insert([
    {
      id: 1,
      email: "marratoon@gmail.com",
      password: "12345",
      username: "mark",
    },
    {
      id: 2,
      email: "mnapearson@gmail.com",
      password: "12345",
      username: "michaela",
    },
    {
      id: 3,
      email: "leonap@gmail.com",
      password: "12345",
      username: "leona",
    },
  ]);

  await knex("events").insert([
    {
      name: "Parents Afternoon @ LIK",
      date: "20/20/09 16:00",
      description: "coffee and tea with teachers",
      location: "LIK",
      userId: 2,
    },
    {
      name: "Concert in Clara Park",
      date: "17/09/20 20:00",
      description: "classical music and folk music",
      location: "Clara Park",
      userId: 2,
    },
    {
      name: "Dinner with Grandparents",
      date: "18/09/20 17:00",
      description: "bring bread!!",
      location: "Nana's house",
      userId: 3,
    },
  ]);

  await knex("tasks").insert([
    {
      task: "Clean bathroom",
      deadline: "16/09/20",
      notes: "buy toilet paper",
      userId: 1,
    },
    {
      task: "Make birthday crown",
      deadline: "27/07/21",
      notes: "get glitter and glue!",
      userId: 3,
    },
    {
      task: "Apply for Junior Developer position",
      deadline: "09/10/20",
      notes: "create badass CV",
      userId: 2,
    },
  ]);
};
