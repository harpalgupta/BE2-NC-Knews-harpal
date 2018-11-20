
exports.up = function (knex, Promise) {
    return knex.schema.createTable("comments", table => {
        table.increments("comment_id").primary();
        table.integer("user_id").references("users.user_id").unsigned;
        table.integer("article_id").references("articles.article_id").unsigned;
        table.integer("votes").defaultTo(0);
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.string("body", 1000)



    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable("comments");
}



// * Each comment should have:
// - `comment_id` which is the primary key
// - `user_id` field that references a user's primary key
// - `article_id` field that references an article's primary key
// - `votes` defaults to 0
// - `created_at` defaults to the current date
//`body`
