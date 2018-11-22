const topicRouter = require('express').Router();
const { getTopics, getAllArticlesForTopics, addTopic } = require('../controllers/topicController');


//   api/topics
topicRouter.route('/').get(getTopics).post(addTopic);

topicRouter.get('/:topic/articles', getAllArticlesForTopics);
module.exports = topicRouter;
