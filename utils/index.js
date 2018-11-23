exports.queriesHandle = (req) => {
  const queries = {
    limit: req.query.limit || 10, sort_by: req.query.sort_by || 'created_at', p: req.query.p || 0, sort_ascending: req.query.sort_ascending || false,
  };
  if (queries.sort_ascending === 'true') { queries.sortOrder = 'asc'; } else queries.sortOrder = 'desc';
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


exports.reformatData = (originalData, newUserObj, typeOfObject, articleTitleID) => originalData.map((row) => {
  // console.log("<<<", userArray[0][article.created_by])
  if (typeOfObject === 'comment') {
    row.article_id = articleTitleID[row.belongs_to];
    const newComment = {
      ...row,
      article_id: articleTitleID[row.belongs_to],
      user_id: newUserObj[row.created_by],
      created_at: new Date(row.created_at),
    };

    // console.log('NEW article id', row.article_id);
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
