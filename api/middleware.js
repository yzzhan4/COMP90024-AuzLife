const bodyParser = require('body-parser');

module.exports = function(app, express) {
    app.use(express.static(__dirname + '/../html'));
    app.use(bodyParser.json());
}