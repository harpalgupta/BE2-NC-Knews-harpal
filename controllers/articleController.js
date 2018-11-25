const { connection } = require('../db/connection');
const { queriesHandle } = require('../utils/index');


exports.getArticles = (req, res, next) => {
  const queries = (queriesHandle(req));


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
  const { body } = req;
  if (!body.inc_votes) {
    return connection('articles').select().where('articles.article_id', req.params.article_id).then(([updatedArticle]) => {
      res.status(200).send(updatedArticle);
    })
      .catch(next);
  }
  if (!Number.isInteger(body.inc_votes) && body.inc_votes) next({ status: 400, msg: 'Invalid inc_votes' });
  return connection('articles').update('votes', connection.raw(`votes + ${body.inc_votes}`)).where('articles.article_id', req.params.article_id).returning('*')
    .then(([untouchedArticle]) => {
      res.status(200).send(untouchedArticle);
    })
    .catch(next);
};

exports.deleteArticle = (req, res, next) => connection('articles').where('articles.article_id', req.params.article_id).del().returning('*')
  .then((result) => {
    if (result.length === 0) return next({ status: 404, msg: 'Non existant Article Id' });
    return res.status(204).send({ msg: 'Deleted item' });
  })
  .catch(next);


exports.getCommentsForArticle = (req, res, next) => {
  const queries = (queriesHandle(req, 'comments'));

  return connection

    .select('comments.comment_id', 'comments.votes', 'comments.created_at', ' body').from('comments')
    .join('users', 'comments.user_id', 'users.user_id')
    .limit(queries.limit)
    .orderBy([queries.sort_by], queries.sortOrder)
    .offset(queries.p * queries.limit)
    .where('comments.article_id', req.params.article_id)
    .then((comments) => {
      // console.log(comments);
      if (comments.length === 0) return next({ status: 404, msg: 'Non existant Article Id' });
      return res.status(200).send(comments);
    })
    .catch(next);
};

exports.addCommentForArticle = (req, res, next) => {
  // console.log('<<<adding comment');
  if (req.body.user_id && req.body.body) {
    const commentPost = {
      user_id: req.body.user_id, body: req.body.body, article_id: req.params.article_id, votes: 0,
    };
    return connection('comments').insert(commentPost).returning('*')
      .then(([comment]) => {
        res.status(201).send(comment);
      })
      .catch(next);
  }
  return res.status(400).send({ msg: 'Malformed Body' });
};

exports.updateComment = (req, res, next) => {
  const { body } = req;

  if (!body.inc_votes) {
    return connection('comments').select().where('comments.comment_id', req.params.comment).then(([untouchedArticle]) => res.status(200).send(untouchedArticle))
      .catch(next);
  }
  if (!Number.isInteger(body.inc_votes) && body.inc_votes) next({ status: 400, msg: 'Invalid inc_votes' });
  else {
    return connection('comments')
    // .update('votes', connection.raw(`votes + ${body.inc_votes}`))
      .increment('votes', body.inc_votes)
      .where('comments.comment_id', req.params.comment)
      .returning('*')
      .then(([updatedArticle]) => {
        if (updatedArticle) { return res.status(200).send(updatedArticle); }
        return res.status(404).send({ msg: 'Non existant Article Id' });
      })
      .catch(next);
  }
};

exports.deleteComment = (req, res, next) => connection('comments').where('comments.comment_id', req.params.comment).del().returning('*')
  .then((result) => {
    if (result.length === 0) return next({ status: 404, msg: 'Non existant Article Id' });
    return res.status(204).send({ msg: 'Deleted item' });
  })
  .catch(next);
/*
  `comment_id`
    - `votes`
    - `created_at`
    - `author` which is the `username` from the users table
    - `body`
  */
