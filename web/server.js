/* Team 46
* Haoyue Xie 1003068 @Melbourne
* Jiayu Li 713551 @Melbourne
* Ruqi Li 1008342 @Melbourne
* Yi Zhang 1032768 @Melbourne
* Zimeng Jia 978322 @Hebei, China
* */

const express = require('express');
const middleware = require('./api/middleware.js');
const routes = require('./api/routes.js');

const app = express();

middleware(app, express);
routes(app, express);

var port = 3000;
app.listen(port, () => console.log(`Listening on port ${port}!`));