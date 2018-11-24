const topicRouter = require('express').Router();
const {
  getTopics, getAllArticlesForTopics, addTopic, addArticleForTopic,
} = require('../controllers/topicController');
const {
  handle405,
} = require('../errors');

//   api/topics
topicRouter.route('/').get(getTopics).post(addTopic).all(handle405);


topicRouter.route('/:topic/articles').get(getAllArticlesForTopics).post(addArticleForTopic).all(handle405);


module.exports = topicRouter;
