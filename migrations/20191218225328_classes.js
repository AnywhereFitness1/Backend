exports.up = function(knex) {
  return knex.schema.createTable("classes", classes => {
    classes.increments();
    classes
      .string("name", 30)
      .notNullable()
      .unique();
    classes.string("type", 30).notNullable();
    classes.timestamp("created_at").defaultTo(knex.fn.now());
    classes.integer("length_minutes").notNullable();
    classes.integer("intensitylvl").notNullable();
    classes.string("location").notNullable();
    classes.integer("current_size").notNullable();
    classes.integer("max_size").notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("classes");
};
