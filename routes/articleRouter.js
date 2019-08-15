const articleRouter = require('express').Router();
const { handle405 } = require('../errors');
const {
  getArticles,
  updateArticle,
  deleteArticle,
  getCommentsForArticle,
  addCommentForArticle,
  updateComment,
  deleteComment,
  getComment,
} = require('../controllers/articleController');

const checkArticleID = (req, res, next, articleid) => {
  // console.log('checking', articleid);
  if (articleid.match(/\D/)) {
    return next({ status: 400, msg: 'Article ID must be integer' });
  }
  return next();
};
const checkCommentID = (req, res, next, commentid) => {
  if (commentid.match(/\D/)) {
    return next({ status: 400, msg: 'Comment ID must be integer' });
  }
  return next();
};

articleRouter.get('/', getArticles).all(handle405);
articleRouter.param('article_id', checkArticleID);
articleRouter.param('comment', checkCommentID);

articleRouter
  .route('/:article_id/comments/:comment')
  .get(getComment)
  .patch(updateComment)
  .delete(deleteComment)
  .all(handle405);
articleRouter
  .route('/:article_id/comments')
  .get(getCommentsForArticle)
  .post(addCommentForArticle)
  .all(handle405);
articleRouter
  .route('/:article_id')
  .get(getArticles)
  .patch(updateArticle)
  .delete(deleteArticle);

// articleRouter.post('/api/articles/:article_id/comments', addCommentsForArticle);

module.exports = articleRouter;
