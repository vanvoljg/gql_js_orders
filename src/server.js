'use strict';

require('dotenv').config();

// GraphQL Endpoint
const express = require('express');
const graphQLHTTP = require('express-graphql');
const app = express();

// schema
const schema = require('./schema.js');

// route
app.use('/graphql', graphQLHTTP({ schema, graphiql: true }));

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
