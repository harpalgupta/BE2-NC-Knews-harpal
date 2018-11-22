
exports.up = function (knex, Promise) {
  return knex.schema.createTable('articles', (table) => {
    table.increments('article_id').primary().notNullable();
    table.string('title').notNullable();
    table.string('body', 2000).notNullable();
    table.integer('votes').defaultTo(0).notNullable();
    table.string('topic').references('topics.slug').notNullable().onDelete('CASCADE');
    table.integer('user_id').references('users.user_id').notNullable().onDelete('CASCADE');
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('articles');
};

// * Each article should have:
// - `article_id` which is the primary key
// - `title`
// - `body`
// - `votes` defaults to 0
// - `topic` field which references the slug in the topics table
// - `user_id` field that references a user's primary key.
// - `created_at` defaults to the current date
//
