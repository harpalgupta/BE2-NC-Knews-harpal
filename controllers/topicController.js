
const { queriesHandle } = require('../utils/index');
const { connection } = require('../db/connection');
// exports.check400 =((req, res, next) =>{
// if (req.params.topics.match(/\d+/))};

exports.getTopics = ((req, res, next) => connection('topics').select()
  .then((topics) => {
    res.status(200).send(topics);
  }).catch(next));


exports.getAllArticlesForTopics = (
  (req, res, next) => {
    const queries = queriesHandle(req);

    return connection('articles')
      .select('articles.article_id', 'users.username as author', 'articles.title', 'articles.votes', 'articles.created_at', 'articles.topic')
      .innerJoin('users', 'users.user_id', '=', 'articles.user_id')
      .rightJoin('comments', 'articles.article_id', '=', 'comments.article_id')
      .count('comments.comment_id as comment_count')
      .groupBy('articles.article_id', 'users.username')
      .where('articles.topic', req.params.topic)
      .limit(queries.limit)
      .orderBy([queries.sort_by], queries.sortOrder)
      .offset(queries.p * queries.limit)
      .then((articles) => {
        // console.log(articles);
        // console.log('<<<<<', queries.sort_by, queries.sortOrder);
        res.status(200).send(articles);
      })
      .catch(next);
  }

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

// Add article for topic
// POST /api/topics/:topic/articles

exports.addArticleForTopic = (
  (req, res, next) => {
    const newArticle = req.body;
    newArticle.topic = req.params.topic;
    return connection('articles').insert(newArticle).returning('*')
      .then((topic) => {
        res.status(201).send(topic);
      })
      .catch(next);
  }
);
