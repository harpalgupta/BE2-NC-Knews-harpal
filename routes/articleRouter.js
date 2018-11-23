const articleRouter = require('express').Router();
const { getArticles, addCommentsForArticle } = require('../controllers/articleController');

// GET /api/topics/:topic/articles

articleRouter.get('/', getArticles);
// articleRouter.post('/api/articles/:article_id/comments', addCommentsForArticle);

articleRouter.get('/:article_id', getArticles);
module.exports = articleRouter;
