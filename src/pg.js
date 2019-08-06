'use strict';

// PostgreSQL connection
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: process.env.DATABASE_MAX_CONNECTIONS,
  idleTimeoutMillis: process.env.DATABASE_IDLE_TIMEOUT_MILLIS,
  connectionTimeoutMillis: process.env.DATABASE_CONNECTION_TIMEOUT_MILLIS,
});

module.exports = {
  pool,
};
