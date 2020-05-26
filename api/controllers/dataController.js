// var couchdbConnection = require("./couchdbConnection.js");
// Test with local couchdb
// const nano = require('nano')('http://admin:90024@172.26.131.147:5984')
// const tweetsdb = nano.use('streaming-userids');
const nano = require('nano')('http://admin:90024@172.26.131.147:5984');
//const nano = require('nano')('http://admin:90024@172.26.134.71:5984');
const dbAge = nano.use('aurin_age');
const dbIncome = nano.use('aurin_income');
const dbEdu = nano.use('aurin_edu');
const dbTest = nano.use('geo-tweets');

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

    getTweetsCountState: function(req, res) {
        dbTest.view('DesignDoc', 'countByState', {
            'keys':[[1,'NSW'],[1,'VIC'],[1,'QLD'],[1,'SA'],[1,'WA'],[1,'TAS'],[1,'NT'],[1,'ACT']],
            'group':'true',
            'stale':'update_after'
            //'stale':'ok'
        }).then((body) => {
            var tweets = {};
            var count = [];
            body.rows.forEach((doc) => {
                tweets[doc.key[1]] = doc.value
            });
            res.send(tweets);
        });
    },

    getTweetsCountCity: function(req,res) {
        dbTest.view('DesignDoc', 'countByCity', {
            'keys':[[1,1],[1,2],[1,3],[1,4],[1,5],[1,6],[1,7],[1,8],[1,9],[1,10],[1,11],[1,12],[1,13],[1,14],[1,15]], //related tweets
            'group':'true',
            'stale':'update_after'
            //'stale':'ok'
        }).then((body) => {
            var tweets = {};
            var count = [];
            body.rows.forEach((doc) => {
                tweets[doc.key[1]] = doc.value
            });
            res.send(tweets);
        });
    },
    // State
    // pie
    getAgeOneState: function (req, res){
        //var states = ["VIC"];
        var code = req.body["region"];
        var states = [stateCodes[code]];
        dbAge.view('DesignState', 'sumByState_All', {
            'keys': states,
            'group':'true'
        }).then((body) => {
            //console.log(body.rows[0]);
            res.send(body.rows[0]);
        });
        // TODO: error handling
        // });
    },

    // bar
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
            // console.log("1");
            // console.log(name);
            // console.log(num);
        })
        // console.log("2");
        // console.log(name);
        // console.log(num);
        dbTest.view('DesignDoc', 'countByState', {
            'keys':[[1,'NSW'],[1,'VIC'],[1,'QLD'],[1,'SA'],[1,'WA'],[1,'TAS'],[1,'NT'],[1,'ACT']],
            'group':'true',
            'stale':'update_after'
            //'stale':'ok'
        }).then((body) => {
            // console.log("3");
            // console.log(name);
            // console.log(num);
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

    // line
    getEduAllState: function(req, res){
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
    },

    // Cities
    // pie
    getAgeOneCity: function(req, res) {
        // TODO
        // var code = req.body["region"];
        // dbAge.view('DesignState', 'sumByCity_All', {
        //     'keys': [code],
        //     'group':'true'
        // }).then((body) => {
        //     //console.log(body.rows[0]);
        //     res.send(body.rows[0]);
        // });
    },

    // bar
    getIncomeAllCities: function(req, res) {
        var num = [];
        var name = [];
        dbIncome.view('DesignDoc', 'sumByCity', {
            //'keys':['Melbourne','Brisbane'],
            'group':'true',
        }).then((body) => {
            body.rows.forEach((doc) => {
                name.push(doc.key);
                num.push(doc.value);
            });
            // console.log("1");
            // console.log(name);
            // console.log(num);
        })
        // console.log("2");
        // console.log(name);
        // console.log(num);
        dbTest.view('DesignDoc', 'countByCity', {
            'keys':[[1,1],[1,2],[1,3],[1,4],[1,5],[1,6],[1,7],[1,8],[1,9],[1,10],[1,11],[1,12],[1,13],[1,14],[1,15]],
            'group':'true',
            'stale':'update_after'
            //'stale':'ok'
        }).then((body) => {
            // console.log("3");
            // console.log(name);
            // console.log(num);
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

    // line
    getEduAllCities: function(req, res) {
        dbEdu.view('DesignDoc', 'sumByCity_All', {
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
