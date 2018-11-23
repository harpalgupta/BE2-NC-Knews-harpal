const topicRouter = require('express').Router();
const {
  getTopics, getAllArticlesForTopics, addTopic, addArticleForTopic,
} = require('../controllers/topicController');


//   api/topics
topicRouter.route('/').get(getTopics).post(addTopic);

topicRouter.route('/:topic/articles').get(getAllArticlesForTopics).post(addArticleForTopic);


module.exports = topicRouter;
