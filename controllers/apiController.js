exports.getApiDescription = ((req, res, next) => res.send({
  'GET /api/topics': 'Gets a list of All Topics',
  'GET /api/topics/:topic/articles': 'Gets all articles for a given topic',
  'GET /api/articles': 'Gets a list of all articles',
  'GET /api/articles/:article_id': 'Get a single article',
  comments_for_single_article: '/api/articles/:article_id/comments',
  single_comment_for_article: '/api/articles/:article_id/comments/:comment_id',
  all_users: '/api/users',
  single_user: '/api/users/:username',
}));
