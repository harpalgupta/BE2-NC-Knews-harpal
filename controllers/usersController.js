const { connection } = require('../db/connection');


exports.getUsers = ((req, res, next) => connection('users').select().modify((queryBuilder) => {
  if (req.params.username) queryBuilder.where('users.username', req.params.username);
})
  .then((users) => {
    if (users.length === 1) return res.status(200).send(users[0]);
    if (users.length === 0) return next({ status: 404, msg: 'Non Existant Username' });
    return res.status(200).send(users);
  })
  .catch(next));
