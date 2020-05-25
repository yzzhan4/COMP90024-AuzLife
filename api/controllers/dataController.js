var couchdbConnection = require("./couchdbConnection.js");
// Test with local couchdb
// const nano = require('nano')('http://admin:90024@172.26.131.147:5984')
// const tweetsdb = nano.use('streaming-userids');
const nano = require('nano')('http://admin:90024@172.26.131.147:5984');
const dbAge = nano.use('aurin_age');
const dbIncome = nano.use('aurin_income');
const dbEdu = nano.use('aurin_edu');
const dbTest = nano.use('gatheing-tweets');

module.exports = {
    // test sending data from backend
    getTestText: function(req, res) {
        res.send({teststr:"Hello from backend"});
    },

    getTestLoc: function(req, res) {
        res.send({lng:133, lat:-28});
    },

    getTweets: function(req, res) {
        tweetsdb.list().then((body) => {
            res.send(body["rows"])
        });
    },

    getMapRegion: function(req, res) {
        console.log('request received:', req.body["region"]);
    },

    getBarChart: function(req, res) {
        dbIncome.view('DesignDoc', 'sumByCity', {
            //'keys':['Melbourne','Brisbane'],
            'group':'true',
        }).then((body) => {
            var num = [];
            var name = [];
            body.rows.forEach((doc) => {
                name.push(doc.key);
                num.push(doc.value);
            });
            // return JSON.stringify(body.rows);
            res.send([num, name]);
            // }).then((bodyjson) => {
            //     res.send(typeof (JSON.parse(bodyjson)));
        })
    },

    getAgeState: function (req, res){
        var states = ["VIC"];

        dbAge.view('DesignState', 'sumByState_All', {
            'keys': states,
            'group':'true'
        }).then((body) => {
            res.send(body.rows[0])
        });
        // TODO: error handling
        // });
    }
}
