const apiRouter = require('express').Router();
const topicRouter = require('./topicRouter');
const articleRouter = require('./articleRouter');
const userRouter = require('./userRouter');
const { getApiDescription } = require('../controllers/apiController');
const {
  handle405,
} = require('../errors');


apiRouter.use('/topics', topicRouter);
apiRouter.use('/articles', articleRouter);
apiRouter.use('/users', userRouter);
apiRouter.route('/').get(getApiDescription).all(handle405);

module.exports = apiRouter;
