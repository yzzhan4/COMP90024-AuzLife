const express = require('express');
const middleware = require('./config/middleware.js')
const routes = require('./config/routes.js')

const app = express();
middleware(app, express);
routes(app, express);

var port = 3000;
app.listen(port, () => console.log(`Listening on port ${port}!`));