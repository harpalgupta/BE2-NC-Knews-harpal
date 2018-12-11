exports.getApiDescription = (req, res, next) => res.send({
  'GET /api/topics': 'Gets a list of All Topics',
  'GET /api/topics/:topic/articles': 'Gets all articles for a given topic',
  'GET /api/articles': 'Gets a list of all articles',
  'GET /api/articles/:article_id': 'Get a single article',
  'GET /api/articles/:article_id/comments':
      'Gets comments for a single article',
  'GET /api/articles/:article_id/comments/:comment_id':
      'Gets a single_comment for an article',
  'GET /api/users': 'Get all users',
  'GET /api/users/:username': 'Gets detailed user info for singleuser',
  'GET /api/topics/:topics/articles?sort_by={votes}&sort_ascending={true}':
      'Gets all articles for a given topic, sorts by given field(article_id, title, body, votes,topic, user_id, created_at) and sorts ascending/descending',
  'POST a new single topic /api/topics with { slug: {slugname}, description: {topic description} }':
      ' valid body is required with slug and description',
  'POST a new comment for an article /api/articles/{article_id}/comments with { user_id: {user_id}, body: {comment body} }':
      'valid body is required with user_id and body',
});
