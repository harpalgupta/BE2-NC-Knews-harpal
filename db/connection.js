
const ENV = process.env.NODE_ENV === 'test' ? 'test' : 'development';

// const ENV = process.env.NODE_ENV;

const config = require('../knexfile');

exports.connection = require('knex')(config[ENV]);
