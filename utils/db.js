const pg = require('knex')({
  client: 'pg',
  connection: process.env.PG_CONNECTION_STRING,
  searchPath: ['public'],
  pool: { min: 0, max: 7 },
  debug: true
});

module.exports = pg