'use strict';

require('dotenv').config();

// PostgreSQL connection
const pg = require('pg');
const DATABASE_URL = process.env.DATABASE_URL;
const client = new pg.Client(DATABASE_URL);

// GraphQL Endpoint
const express = require('express');
const graphQLHTTP = require('express-graphql');
const app = express();

const schema = require('./schema.js');

app.use(graphQLHTTP({ schema, graphiql: true }));

let isRunning = false;

module.exports = {
  server: app,
  start: (port) => {
    if (!isRunning) {
      app.listen(port, () => {
        isRunning = true;
        console.log(`Server running on ${port}`);
      });
    } else {
      console.log('Server already started');
    }
  },
};
