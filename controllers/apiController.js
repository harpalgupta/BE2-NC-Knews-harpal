exports.getApiDescription = ((req, res, next) => res.send({
  all_topics: '/api/topics',
  all_articles_for_topic: '/api/topics/:topic/articles',
  all_articles: '/api/articles',
  single_article: '/api/articles/:article_id',
  comments_for_single_article: '/api/articles/:article_id/comments',
  single_comment_for_article: '/api/articles/:article_id/comments/:comment_id',
  all_users: '/api/users',
  single_user: '/api/users/:username',
}));
