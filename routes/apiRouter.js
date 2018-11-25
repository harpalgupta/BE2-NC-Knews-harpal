const apiRouter = require('express').Router();
const topicRouter = require('./topicRouter');
const articleRouter = require('./articleRouter');
const userRouter = require('./userRouter');
const {
  handle405,
} = require('../errors');


const getApiDescription = ((req, res, next) => res.send({
  all_topics: '/api/topics',
  all_articles_for_topic: '/api/topics/:topic/articles',
  all_articles: '/api/articles',
  single_article: '/api/articles/:article_id',
  comments_for_single_article: '/api/articles/:article_id/comments',
  single_comment_for_article: '/api/articles/:article_id/comments/:comment_id',
  all_users: '/api/users',
  single_user: '/api/users/:username',
}));
apiRouter.use('/topics', topicRouter);
apiRouter.use('/articles', articleRouter);
apiRouter.use('/users', userRouter);
apiRouter.route('/').get(getApiDescription).all(handle405);

module.exports = apiRouter;
