const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require("cors");

const sqlApiDatabaseStartup = require('./database/cosmos_sql_api/db-sql-api-startup-script');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// app.use('/data', dataRouter);
app.use('/api', routes);

(async function() {
  try { 
    await sqlApiDatabaseStartup.initialize();
  }catch(error) {
    console.log("oops");
  }
})();

module.exports = app;
