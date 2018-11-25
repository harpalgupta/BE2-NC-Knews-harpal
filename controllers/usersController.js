const { connection } = require('../db/connection');


exports.getUsers = ((req, res, next) => connection('users').select().modify((queryBuilder) => {
  if (req.params.username) queryBuilder.where('users.username', req.params.username);
})
  .then((users) => {
    if (users.length === 1) return res.status(200).send(users[0]);
    return res.status(200).send(users);
  })
  .catch(next));
