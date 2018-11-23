
// const ENV = process.env.NODE_ENV === 'test' ? 'test' : 'development';

// const ENV = process.env.NODE_ENV;
// const config = require('../knexfile');

const ENV = process.env.NODE_ENV || 'development';
const config = ENV === 'production' ? { client: 'pg', connection: process.env.DATABASE_URL } : require('../knexfile')[ENV];


exports.connection = require('knex')(config);
