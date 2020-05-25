var couchdbConnection = require("./couchdbConnection.js");
// Test with local couchdb
// const nano = require('nano')('http://admin:90024@172.26.131.147:5984')
// const tweetsdb = nano.use('streaming-userids');
const nano = require('nano')('http://admin:90024@172.26.131.147:5984');
const dbIncome = nano.use('aurin_income')
const dbAge = nano.use('aurin_age')

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
        res.send()
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

    Age_viewnumOfCity: function (req, res){
        dbAge.view('DesignCity', 'numOfCity', {
            //'keys':['Melbourne','Brisbane'],
            'group':'true'
        }).then((body) => {
            res.send(body)
        })
        // TODO: error handling
        // });
    }
}
