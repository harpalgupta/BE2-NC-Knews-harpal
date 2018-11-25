const { connection } = require('../db/connection');
const { queriesHandle } = require('../utils/index');


exports.getArticles = (req, res, next) => {
  const queries = (queriesHandle(req));
  // if (queries.valid === false) {
  //   return res.status(400).send({ msg: 'Malformed Query' });
  // }
  // if (req.params.article_id && req.params.article_id.match(/\D/)) {
  //   return res.status(400).send({ msg: 'Malformed Parameter' });
  // }

  return connection('articles').select('articles.article_id', 'users.username as author', 'articles.title', 'articles.votes', 'articles.created_at', 'articles.topic')
    .innerJoin('users', 'users.user_id', '=', 'articles.user_id')
    .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
    .count('comments.comment_id as comment_count')
    .groupBy('articles.article_id', 'users.username')
    .limit(queries.limit)
    .orderBy([queries.sort_by], queries.sortOrder)
    .offset(queries.p * queries.limit)
    // deals with one article too
    .modify((queryBuilder) => {
      if (req.params.article_id) queryBuilder.where('articles.article_id', req.params.article_id);
    })
    .then((articles) => {
      if (articles.length === 0) return next({ status: 404, msg: 'Non existant Article Id' });
      return res.status(200).send(articles);
    })
    .catch(next);
};

exports.updateArticle = (req, res, next) => {
  console.log('<<<<<<<<<<<<<<<<<<IN update Article');
  const { body } = req;
  return connection('articles').update('votes', connection.raw(`votes + ${body.inc_votes}`)).where('articles.article_id', req.params.article_id).returning('*')
    .then(([updatedArticle]) => {
      res.status(200).send(updatedArticle);
    })
    .catch(console.log);
};
