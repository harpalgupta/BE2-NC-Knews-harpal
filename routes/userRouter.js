const userRouter = require('express').Router();
const { getUsers } = require('../controllers/usersController');
const {
  handle405,
} = require('../errors');

/**
 * @swagger
 * /users:
 *    get:
 *      description: This should return all users
 */
userRouter.get('/', getUsers).all(handle405);
userRouter.get('/:username', getUsers).all(handle405);

module.exports = userRouter;
