var dataController = require("./controllers/dataController.js");

module.exports = function(app, express) {
    app.get('/api/testText', dataController.getTestText);
    app.get('/api/testLoc', dataController.getTestLoc);
    app.get('/api/tweets', dataController.getTweets);

    app.post('/api/mapregion', dataController.getMapRegion)
}