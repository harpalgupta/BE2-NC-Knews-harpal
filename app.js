const app = require('express')();
const bodyParser = require('body-parser');
const cors = require('cors');
const apiRouter = require('./routes/apiRouter');
const { handle404, handleOtherErrors, handle422 } = require('./errors');

const expressSwagger = require('express-swagger-generator')(app);

let options = {
    swaggerDefinition: {
        info: {
            description: 'This is a sample server',
            title: 'Swagger',
            version: '1.0.0',
        },
        host: 'localhost:9090',
        basePath: '/api',
        produces: [
            "application/json",
            "application/xml"
        ],
        schemes: ['http', 'https'],
        securityDefinitions: {
            JWT: {
                type: 'apiKey',
                in: 'header',
                name: 'Authorization',
                description: "",
            }
        }
    },
    basedir: __dirname, //app absolute path
    files: ['./routes/*.js'] //Path to the API handle folder
};
expressSwagger(options)


app.use(cors());
app.use(bodyParser.json());

app.use('/api', apiRouter);

app.use('/*', handle404);
app.use('/*', handle422);

app.use(handleOtherErrors);

module.exports = app;
