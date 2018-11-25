const apiRouter = require('express').Router();
const topicRouter = require('./topicRouter');
const articleRouter = require('./articleRouter');
const userRouter = require('./userRouter');
const {
  handle405,
} = require('../errors');


const getApiDescription = ((req, res, next) => res.send({ msg: 'Welcome' }));

apiRouter.use('/topics', topicRouter);
apiRouter.use('/articles', articleRouter);
apiRouter.use('/users', userRouter);
apiRouter.route('/').get(getApiDescription).all(handle405);

module.exports = apiRouter;
