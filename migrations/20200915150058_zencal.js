exports.up = async function (knex) {
  await knex.schema.createTable("users", (table) => {
    table.increments();
    table.string("email").unique().notNullable();
    table.string("password").notNullable();
    table.string("username").unique().notNullable();
  });

  await knex.schema.createTable("events", (table) => {
    table.increments();
    table.string("name").unique().notNullable();
    table.date("date");
    table.string("location");
    table.string("description");
    table.boolean("attending").defaultTo(true);
    table.integer("userId").unsigned().references("users.id");
  });

  await knex.schema.createTable("tasks", (table) => {
    table.increments();
    table.string("task").notNullable();
    table.date("deadline");
    table.string("notes");
    table.boolean("completed").defaultTo(false);
    table.integer("userId").unsigned().references("users.id");
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTable("users");
  await knex.schema.dropTable("events");
  await knex.schema.dropTable("tasks");
};
