const articleRouter = require('express').Router();
const { getArticles } = require('../controllers/articleController');

// GET /api/topics/:topic/articles

articleRouter.get('/', getArticles);

module.exports = articleRouter;
