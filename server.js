const express = require('express');
const middleware = require('./api/middleware.js');
const routes = require('./api/routes.js');

const app = express();

middleware(app, express);
routes(app, express);

var port = 3000;
app.listen(port, () => console.log(`Listening on port ${port}!`));