
exports.up = function (knex, Promise) {
    return knex.schema.createTable("articles", table => {
        table.increments("article_id").primary();
        table.string("title");
        table.string("body", 2000);
        table.integer("votes").defaultTo(0);
        table.string("topic").references("topics.slug");
        table.integer("user_id").references("users.user_id").unsigned;
        table.timestamp('created_at').defaultTo(knex.fn.now());

    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable("articles")
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