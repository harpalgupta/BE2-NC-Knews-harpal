const articleRouter = require('express').Router();

const { getArticles, updateArticle, addCommentsForArticle } = require('../controllers/articleController');

const checkArticleID = (req, res, next, articleid) => {
  if (articleid.match(/\D/)) { return next({ status: 400, msg: 'Article ID must be integer' }); }
  return next();
};
// GET /api/topics/:topic/articles
// articleRouter.route('/:article_id').param(checkArticleID);
articleRouter.get('/', getArticles);
articleRouter.param('article_id', checkArticleID);
articleRouter.route('/:article_id').get(getArticles).patch(updateArticle);

// articleRouter.post('/api/articles/:article_id/comments', addCommentsForArticle);

module.exports = articleRouter;
