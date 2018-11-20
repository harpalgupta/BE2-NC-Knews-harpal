const ENV = process.env.NODE_ENV;
const topicData = require('../db/data/development-data/topics');
const userData = require('../db/data/development-data/users');
const articleData = require('../db/data/development-data/articles');
const commentData = require('../db/data/development-data/comments');
let userIDArray = [];


const { usersAndUserID, reformatObject, articleTitleAndArticleID } = require('../utils')



exports.seed = function (knex, Promise) {

  // Deletes ALL existing entries
  return knex('topics').del()
    .then(() => {
      // Inserts seed entries
      return knex('topics').insert(topicData);
    })
    .then(() => {
      return knex('users').del()
        .then(() => {
          return knex('users').insert(userData).returning('*');

        })
    })
    .then((userArray) => {
      userIDArray = usersAndUserID(userArray)
      return usersAndUserID(userArray);

    }
    )
    .then(newUserObj => {

      return reformatObject(articleData, newUserObj);


    })
    .then((newArticleData) => {
      return knex('articles').del()
        .then(() => {
          return knex('articles').insert(newArticleData).returning('*');

        })
    })
    .then((articles) => {
      const articleTitleID = articleTitleAndArticleID(articles)

      return reformatObject(commentData, userIDArray, "article", articleTitleID);

    })

    .then((newCommentData) => {
      return knex('comments').insert(newCommentData).returning('*');
    }
    )
    .catch(err => {
      console.log(err)
    })

    .then(console.log)






};
