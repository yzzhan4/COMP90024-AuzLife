/* Team 46
* Haoyue Xie 1003068 @Melbourne
* Jiayu Li 713551 @Melbourne
* Ruqi Li 1008342 @Melbourne
* Yi Zhang 1032768 @Melbourne
* Zimeng Jia 978322 @Hebei, China
* */

var dataController = require("./controllers/dataController.js");

module.exports = function(app, express) {
    app.get('/api/testText', dataController.getTestText);
    app.get('/api/testLoc', dataController.getTestLoc);
    app.get('/api/tweets', dataController.getTweets);

    app.post('/api/ageState', dataController.getAgeOneState);
    app.post('/api/langState', dataController.getLangOneState);
    app.get('/api/incomeState', dataController.getIncomeAllState);
    app.get('/api/eduState', dataController.getEduAllState);

    app.post('/api/ageCity', dataController.getAgeOneCity);
    app.post('/api/langCity', dataController.getLangOneCity);
    app.get('/api/incomeCity', dataController.getIncomeAllCities);
    app.get('/api/eduCity', dataController.getEduAllCities);

    app.get('/api/tweetsCity', dataController.getTweetsCountCity);
    app.get('/api/tweetsState', dataController.getTweetsCountState);

}