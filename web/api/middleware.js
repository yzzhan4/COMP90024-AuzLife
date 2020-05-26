/* Team 46
* Haoyue Xie 1003068 @Melbourne
* Jiayu Li 713551 @Melbourne
* Ruqi Li 1008342 @Melbourne
* Yi Zhang 1032768 @Melbourne
* Zimeng Jia 978322 @Hebei, China
* */

const bodyParser = require('body-parser');

module.exports = function(app, express) {
    app.use(express.static(__dirname + '/../html'));
    app.use(bodyParser.json());
}