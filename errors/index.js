
exports.handle400 = (req, res, next) => {
  next({
    status: 400,
    msg: 'Bad Request',
  });
};


exports.handle405 = (req, res, next) => {
  // checks 404 then responds with that otherwise passes it on
  next({
    status: 405,
    msg: 'Method not allowed',
  });
};


exports.handle422 = (err, req, res, next) => {
  const codesFor422 = { 23505: 'Duplicate key' };
  if (codesFor422[err.code]) {
    // console.log(err);
    next({
      status: 422,
      msg: codesFor422[err.code],
    });
  } else next(err);
};

exports.handle404 = (req, res, next) => {
  // checks 404 then responds with that otherwise passes it on
  next({
    status: 404,
    msg: 'Page not found',
  });
};
exports.handleOtherErrors = (err, req, res, next) => {
  console.log(err);
  if (err.status) {
    res.status(err.status).send({
      msg: err.msg,
    });
  } else {
    res.status(500).send({
      msg: 'internal server error',
    });
  }
};
