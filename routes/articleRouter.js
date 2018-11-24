const articleRouter = require('express').Router();
const { getArticles, addCommentsForArticle } = require('../controllers/articleController');

// GET /api/topics/:topic/articles

articleRouter.get('/', getArticles);
articleRouter.get('/:article_id', getArticles);

// articleRouter.post('/api/articles/:article_id/comments', addCommentsForArticle);

module.exports = articleRouter;
