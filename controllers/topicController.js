
const { queriesHandle } = require('../utils/index');
const { connection } = require('../db/connection');


// exports.check400 =((req, res, next) =>{

exports.getTopics = ((req, res, next) => connection('topics').select()
  .then((topics) => {
    res.status(200).send({ topics });
  }).catch(next));


exports.getAllArticlesForTopics = (
  (req, res, next) => {
    const queries = queriesHandle(req);


    return connection('articles')
      .select('articles.article_id', 'users.username as author', 'articles.title', 'articles.votes', 'articles.created_at', 'articles.topic')
      .innerJoin('users', 'users.user_id', '=', 'articles.user_id')
      .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
      .count('comments.comment_id as comment_count')
      .groupBy('articles.article_id', 'users.username')
      .where('articles.topic', req.params.topic)
      .limit(queries.limit)
      .orderBy([queries.sort_by], queries.sortOrder)
      .offset(queries.p * queries.limit)
      .then((articles) => {
        if (articles.length === 0) return next({ status: 404, msg: 'Invalid Topic' });
        return res.status(200).send({ articles });
      })
      .catch(next);
  }

);


exports.addTopic = (
  (req, res, next) => {
    if (req.body.slug && req.body.description) {
      return connection('topics').insert(req.body).returning('*')
        .then((topic) => {
          if (topic.length === 1) {
            const singleTopic = topic[0];
            // console.log([singleTopic]);
            res.status(201).send({ topic: singleTopic });
          }
          if (topic.length > 1) res.status(201).send({ topic });
          return next(topic);
        })
        .catch(next);
    }
    return res.status(400).send({ msg: 'Malformed Body' });
  });

// Add article for topic
// POST /api/topics/:topic/articles

exports.addArticleForTopic = (
  (req, res, next) => {
    if (!req.body.title || !req.body.user_id || !req.body.body) return res.status(400).send({ msg: 'Malformed Body' });

    const newArticle = req.body;
    newArticle.topic = req.params.topic;
    return connection('articles').insert(newArticle).returning('*')
      .then(([article]) => {
        res.status(201).send({ article });
      })
      .catch(next);
  }
);
