'use strict';

require('dotenv').config();

// GraphQL Endpoint
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const app = express();

// GraphQL Schema
const schema = require('./schema.js');

// route
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV !== 'production',
  })
);

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
