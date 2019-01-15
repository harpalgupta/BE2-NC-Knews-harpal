// Update with your config settings.
const { DB_URL } = process.env;
module.exports = {

  development: {
    client: 'pg',
    connection: {
      database: 'knews',
      user: 'USERNAME',
      password: 'PASSWORD',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: './db/migrations',
    },

  },
  test: {
    client: 'pg',
    connection: {
      database: 'knews_test',
      user: 'USERNAME',
      password: 'PASSWORD',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: './db/migrations',
    },
  },

  production: {
    client: 'pg',
    connection: `${DB_URL}?ssl=true`,
    migrations: {
      directory: './db/migrations/',
    },
    seeds: {
      directory: './seeds/',
    },
  },
};
