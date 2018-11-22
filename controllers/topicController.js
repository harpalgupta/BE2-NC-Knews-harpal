const { usersAndUserID, reformatData, articleTitleAndArticleID } = require('../utils');

const { connection } = require('../db/connection');
// exports.check400 =((req, res, next) =>{
// if (req.params.topics.match(/\d+/))};

exports.getTopics = ((req, res, next) => connection('topics').select()
  .then((topics) => {
    res.status(200).send(topics);
  }).catch(next));

exports.getAllArticlesForTopics = (
  (req, res, next) => connection('articles').innerJoin('users', 'users.user_id', '=', 'articles.user_id').select('articles.user_id as author', 'title', 'article_id', 'votes', 'users.username as author')
  // .where('article.topic', req.params.topic)
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
