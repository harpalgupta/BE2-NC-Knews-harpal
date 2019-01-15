exports.queriesHandle = (req, typeOfData) => {
  const queries = {
    limit: req.query.limit || 10, sort_by: req.query.sort_by || 'created_at', p: req.query.p - 1 || 0, sort_ascending: req.query.sort_ascending || false,
  };
  if (queries.sort_ascending === 'true') { queries.sortOrder = 'asc'; } else queries.sortOrder = 'desc';


  if (typeOfData === 'comments') {
    const validColumnsComments = {
      article_id: 'comments.comment_id', user_id: 'comments.user_id', votes: 'comments.votes', created_at: 'comments.created_at', body: 'comments.body', author: 'users.username',
    };
    if (validColumnsComments[req.query.sort_by]) queries.sort_by = validColumnsComments[req.query.sort_by]; else queries.sort_by = 'created_at';
  } else {
    const validColumnsArticles = {
      article_id: 'articles.article_id', username: 'articles.username', title: 'articles.title', votes: 'articles.votes', created_at: 'articles.created_at', topic: 'articles.topics', author: 'articles.username', comment_count: 'comment_count',
    };
    if (validColumnsArticles[req.query.sort_by]) queries.sort_by = validColumnsArticles[req.query.sort_by]; else queries.sort_by = 'created_at';
  }


  if (queries.limit > 0 && req.query.p >= 0) queries.valid = true;
  else queries.valid = false;
  return queries;
};


exports.usersAndUserID = (userArray) => {
  const result = userArray.reduce((userObj, row) => {
    userObj[row.username] = row.user_id;
    return userObj;
  }, {});
  return result;
};
exports.articleTitleAndArticleID = (userArray) => {
  const result = userArray.reduce((userObj, row) => {
    userObj[row.title] = row.article_id;
    return userObj;
  }, {});
  return result;
};


exports.reformatData = (originalData, newUserObj,
  typeOfObject, articleTitleID) => originalData.map((row) => {
  // console.log("<<<", userArray[0][article.created_by])
  if (typeOfObject === 'comment') {
    row.article_id = articleTitleID[row.belongs_to];
    const newComment = {
      ...row,
      article_id: articleTitleID[row.belongs_to],
      user_id: newUserObj[row.created_by],
      created_at: new Date(row.created_at),
    };

    delete newComment.belongs_to;
    delete newComment.created_by;
    return newComment;
  }


  const newArticle = {
    ...row,
    user_id: newUserObj[row.created_by],
    created_at: new Date(row.created_at),
  };

  delete newArticle.created_by;
  return newArticle;
});
