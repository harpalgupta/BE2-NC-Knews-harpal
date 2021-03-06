const app = require('express')();
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./swagger.json');
const apiRouter = require('./routes/apiRouter');
const { handle404, handleOtherErrors, handle422 } = require('./errors');

// const { PORT = '9090', HOST = 'localhost' } = process.env;// v1 api routes


// swaggerDoc.host = `${HOST}:${PORT}`;

// app.use('/api/v1/', require('./routes/'));
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDoc));


app.use(cors());

app.use('/api', apiRouter);

app.use('/*', handle404);
app.use('/*', handle422);

app.use(handleOtherErrors);

module.exports = app;
