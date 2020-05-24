var couchdbConnection = require("../couchdbConnection.js");
// Test with local couchdb
//const nano = require('nano')('http://admin:yosoro@localhost:5984')
//const tweetsdb = nano.use('new');

module.exports = {
    getTweets: function(req, res) {
        tweetsdb.list().then((body) => {
            res.send(body["rows"])
        });
    },

    // test sending coordinate for initializing map
    getTestLoc: function(req, res) {
        res.send({lat:-32,lng:100});
    },
    getBarChart: function(req, res) {
        res.send({SA4code:101});
    },

    Age_viewnumOfCity: function (req, res){
        res.send(couchdbConnection.Age_viewnumOfCity()["rows"]);
        // dbAge.view('DesignCity', 'numOfCity', {
        //     //'keys':['Melbourne','Brisbane'],
        //     'group':'true'
        // }).then((body) => {
        //     res.send(body["rows"]);
        //     // TODO: error handling
        // });
    }
}
