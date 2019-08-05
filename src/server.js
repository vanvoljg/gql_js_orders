'use strict';

require('dotenv').config();
const express = require('express');
const pg = require('pg');

const app = express();

const DATABASE_URL = process.env.DATABASE_URL;

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
