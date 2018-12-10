
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
    next({
      status: 422,
      msg: codesFor422[err.code],
    });
  } else next(err);
};

exports.handle404 = (err, req, res, next) => {
  // checks 404 then responds with that otherwise passes it on

  const codesFor404 = { 23503: 'Page not found' };
  if (codesFor404[err.code]) {
    err.status = 404;
    err.msg = codesFor404[err.code];
  } else return next(err);

  if (err.status === 404) {
    return next({
      status: 404,
      msg: err.msg || 'Page not found',
    });
  }
  return next(err);
};


exports.handleOtherErrors = (err, req, res, next) => {
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
