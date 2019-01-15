
const {
  topicData, userData, articleData, commentData,
} = require('../db/data/index');


const { usersAndUserID, reformatData, articleTitleAndArticleID } = require('../utils');


exports.seed = function (knex, Promise) {
  return knex('comments').del()
    .then(() => knex('topics').del())
    .then(() => knex('users').del())
    .then(() => knex('articles').del())
    .then(() => knex('topics').insert(topicData))
    .then(() => knex('users').insert(userData).returning('*'))
    .then(userArray => usersAndUserID(userArray))
    .then((userLookup) => {
      const newArticleData = reformatData(articleData, userLookup);
      return Promise.all([userLookup, newArticleData]);
    })
    .then(([userLookup, newArticleData]) => {
      const articles = knex('articles').insert(newArticleData).returning('*');
      return Promise.all([userLookup, articles]);
    })

    .then(([userLookup, articles]) => {
      const articleRefObj = articleTitleAndArticleID(articles);
      const newCommentData = reformatData(commentData, userLookup, 'comment', articleRefObj);

      return newCommentData;
    })

    .then(newCommentData => knex('comments').insert(newCommentData).returning('*'))
    .catch((err) => {
    });
};
