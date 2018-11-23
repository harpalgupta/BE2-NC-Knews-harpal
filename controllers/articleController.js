const { connection } = require('../db/connection');
const { queriesHandle } = require('../utils/index');

exports.getArticles = (req, res, next) => {
  const queries = (queriesHandle(req));
  connection('articles').select('articles.article_id', 'users.username as author', 'articles.title', 'articles.votes', 'articles.created_at', 'articles.topic')
    .innerJoin('users', 'users.user_id', '=', 'articles.user_id')
    .rightJoin('comments', 'articles.article_id', '=', 'comments.article_id')
    .count('comments.comment_id as comment_count')
    .groupBy('articles.article_id', 'users.username')
    .limit(queries.limit)
    .orderBy([queries.sort_by], queries.sortOrder)
    .offset(queries.p * queries.limit)
    .then((articles) => {
      console.log(articles);
      // console.log('<<<<<', queries.sort_by, queries.sortOrder);
      res.status(200).send(articles);
    });
};
