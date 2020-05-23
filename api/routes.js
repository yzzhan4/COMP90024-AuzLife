var dataController = require("./controllers/dataController.js");

module.exports = function(app, express) {
    app.get('/api/tweets', dataController.getTweets);
    app.get('/api/testloc', dataController.getTestLoc);
    app.get('/api/testbarchart', dataController.getBarChart);

}