var couchdbConnection = require("./couchdbConnection.js");
// Test with local couchdb
// const nano = require('nano')('http://admin:90024@172.26.131.147:5984')
// const tweetsdb = nano.use('streaming-userids');
const nano = require('nano')('http://admin:90024@172.26.131.147:5984');
const dbAge = nano.use('aurin_age');
const dbIncome = nano.use('aurin_income');
const dbEdu = nano.use('aurin_edu');
const dbTest = nano.use('gathering-tweets');

var stateCodes = {
    "1":"NSW",
    "2":"VIC",
    "3":"QLD",
    "4":"SA",
    "5":"WA",
    "6":"TAS",
    "7":"NT",
    "8":"ACT"
}

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

    getMapCity: function(req, res) {
        console.log('request received:', req.body["region"]);
        res.send()
    },

    // getMapState: function(req, res) {
    //     console.log('request received:', req.body["STATE_CODE"]);
    //
    //     res.send()
    // },

    getIncomeAllState: function(req, res) {
        var num = [];
        var name = [];

        dbIncome.view('DesignDoc', 'sumByState', {
            //'keys':['Melbourne','Brisbane'],
            'group':'true',
        }).then((body) => {
            body.rows.forEach((doc) => {
                name.push(doc.key);
                num.push(doc.value);
            });
            // res.send([tweets, body.rows]);
        })
        dbTest.view('DesignDoc', 'countByState', {
            'keys':[[1,'NSW'],[1,'VIC'],[1,'QLD'],[1,'SA'],[1,'WA'],[1,'TAS'],[1,'NT'],[1,'ACT']],
            'group':'true',
            //'stale':'update_after'
            'stale':'ok'
        }).then((body) => {

            var tweets = {};
            var count = [];
            body.rows.forEach((doc) => {
                tweets[doc.key[1]] = doc.value
            });

            name.forEach((region) => {
               count.push(tweets[region])
            });

            res.send([num, name, count]);
        });

    },

    getAgeOneState: function (req, res){
        var code = req.body["region"];
        //var states = ["VIC"];
        var states = [stateCodes[code]];
        console.log(states);
        dbAge.view('DesignState', 'sumByState_All', {
            'keys': states,
            'group':'true'
        }).then((body) => {
            res.send(body.rows[0])
        });
        // TODO: error handling
        // });
    },

    getEduAllState: function (req, res){
        dbEdu.view('DesignDoc', 'sumByState_All', {
            //'keys':['VIC'],
            'group':'true'
        }).then((body) => {
            var datalist = [];
            body.rows.forEach((doc) => {
                var region = {name: doc.key, type: 'line', data: doc.value.slice(0, 5)}
                datalist.push(region)
            });
            res.send(datalist)
        });
        // TODO: error handling
        // });
    }
}
