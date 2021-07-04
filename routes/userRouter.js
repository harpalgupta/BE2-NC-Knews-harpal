const userRouter = require('express').Router();
const { getUsers } = require('../controllers/usersController');
const { getApiDescription } = require('../controllers/apiController');

const {
  handle405,
} = require('../errors');

/**
 * @swagger
 * /users:
 *    get:
 *      description: This should return all users
 */
userRouter.get('/', getApiDescription).all(handle405);

userRouter.get('/:username', getUsers).all(handle405);

module.exports = userRouter;
