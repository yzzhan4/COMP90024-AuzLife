var dataController = require("./controllers/dataController.js");
//var couchdbConnection = require("./couchdbConnection.js");

module.exports = function(app, express) {
    app.get('/api/testText', dataController.getTestText);
    app.get('/api/testLoc', dataController.getTestLoc);
    app.get('/api/tweets', dataController.getTweets);

    app.get('/api/testbarchart', dataController.getBarChart);
    app.get('/api/numofcity', dataController.Age_viewnumOfCity);

}