const app = require('express')();
const bodyParser = require('body-parser');
const apiRouter = require('./routes/apiRouter');
const {
  handle404, handleOtherErrors, handle422, handle405,
} = require('./errors');

app.use(bodyParser.json());

app.use('/api', apiRouter);


app.use('/*', handle404);
app.use('/*', handle422);

app.use(handleOtherErrors);

module.exports = app;
