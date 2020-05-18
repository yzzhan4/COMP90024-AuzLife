const express = require('express');
const middleware = require('./config/middleware.js')
const routes = require('./config/routes.js')
// Test with local couchdb
const nano = require('nano')('http://admin:yosoro@localhost:5984');
const db = nano.use('assignment2/tweets3');

const app = express();
middleware(app, express);
routes(app, express, db);

var port = 3000;
app.listen(port, () => console.log(`Listening on port ${port}!`));