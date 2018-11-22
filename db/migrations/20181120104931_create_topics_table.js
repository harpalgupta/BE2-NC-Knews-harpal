
exports.up = function (knex, Promise) {
  return knex.schema.createTable('topics', (table) => {
    table.string('slug').primary().notNullable();
    table.string('description').notNullable();
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('topics');
};
// separate tables for topics, articles, users and comments
// * Each topic should have:
// - `slug` field which is a unique string that acts as the table's primary key
// - `description` field which is a string giving a brief description of a given topic
//
// * Each user should have:
// - `user_id` which is a primary key for the topics table
// - `username`
// - `avatar_url`
// - `name`
//
// * Each article should have:
// - `article_id` which is the primary key
// - `title`
// - `body`
// - `votes` defaults to 0
// - `topic` field which references the slug in the topics table
// - `user_id` field that references a user's primary key.
// - `created_at` defaults to the current date
//
//
// * Each comment should have:
// - `comment_id` which is the primary key
// - `user_id` field that references a user's primary key
// - `article_id` field that references an article's primary key
// - `votes` defaults to 0
// - `created_at` defaults to the current date
// `body`
