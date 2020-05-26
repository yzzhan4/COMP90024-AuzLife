var dataController = require("./controllers/dataController.js");


module.exports = function(app, express) {
    app.get('/api/testText', dataController.getTestText);
    app.get('/api/testLoc', dataController.getTestLoc);
    app.get('/api/tweets', dataController.getTweets);

    app.post('/api/ageState', dataController.getAgeOneState);
    app.get('/api/incomeState', dataController.getIncomeAllState);
    app.get('/api/eduState', dataController.getEduAllState);

    app.post('/api/ageCity', dataController.getAgeOneCity);
    app.get('/api/incomeCity', dataController.getIncomeAllCities);
    app.get('/api/eduCity', dataController.getEduAllCities);

    app.get('/api/tweetsCity', dataController.getTweetsCountCity);
    app.get('/api/tweetsState', dataController.getTweetsCountState);

}