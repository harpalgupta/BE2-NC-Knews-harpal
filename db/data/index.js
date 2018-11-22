const test = require('./test-data');
const development = require('./development-data');

const env = process.env.NODE_ENV || 'development';

console.log('ENVIRONMENT FOR SEED DATA', env, process.env.NODE_ENV);

const data = { test, development };

module.exports = data[env];
