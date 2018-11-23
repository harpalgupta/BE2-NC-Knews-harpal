const { usersAndUserID, reformatData, articleTitleAndArticleID } = require('../utils');

const { connection } = require('../db/connection');
// exports.check400 =((req, res, next) =>{
// if (req.params.topics.match(/\d+/))};

exports.getTopics = ((req, res, next) => connection('topics').select()
  .then((topics) => {
    res.status(200).send(topics);
  }).catch(next));


// exports.getAllArticlesForTopics = (
//   (req, res, next) => connection.raw('select articles.article_id, count(comments.comment_id) as comment_count, users.username as author, title , articles.body, articles.votes from articles right join comments on articles.article_id = comments.article_id  join users on articles.user_id = users.user_id group by articles.article_id, users.username').groupBy('articles.article_id', 'comments.comment_id')


exports.getAllArticlesForTopics = (
  (req, res, next) => connection('articles')
    .select('articles.article_id', 'users.username as author', 'articles.title', 'articles.votes', 'articles.created_at', 'articles.topic').where('articles.topic', req.params.topic)
    .innerJoin('users', 'users.user_id', '=', 'articles.user_id')
    .rightJoin('comments', 'articles.article_id', '=', 'comments.article_id')
    .count('comments.comment_id as comment_count')
    .groupBy('articles.article_id', 'users.username')
    .then((articles) => {
      console.log(articles);
      res.status(200).send(articles);
    })
    .catch(next)

);

/*
  each article should have:
    - `author` which is the `username` from the users table,
    - `title`
    - `article_id`
    - `votes`
    - `comment_count`
  */


exports.addTopic = (
  (req, res, next) => connection('topics').insert(req.body).returning('*')
    .then((topics) => {
      res.status(201).send(topics);
    })
    .catch(next));
