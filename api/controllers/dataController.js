var couchdbConnection = require("../couchdbConnection");
// Test with local couchdb
//const nano = require('nano')('http://admin:yosoro@localhost:5984')
//const tweetsdb = nano.use('new');
const nano = require('nano')('http://admin:90024@172.26.131.147:5984');
const dbIncome = nano.use('aurin_income');
const dbAge = nano.use('aurin_age');
const dbTest = nano.use('gathering-tweets');

module.exports = {
    getTweets: function(req, res) {
        tweetsdb.list().then((body) => {
            res.send(body["rows"])
        });
    },

    // test sending coordinate for initializing map
    getTestLoc: function(req, res) {
        dbTest.view('DesignDoc', 'countByState', {
            'keys':[[1,'NSW'],[1,'VIC'],[1,'QLD'],[1,'SA'],[1,'WA'],[1,'TAS'],[1,'NT'],[1,'ACT']],
            //'keys':[[0,'NSW'],[0,'VIC'],[0,'QLD'],[0,'SA'],[0,'WA'],[0,'TAS'],[0,'NT'],[0,'ACT']],
            'group':'true',
            //'stale':'update_after'
            'stale':'ok'
        }).then((body) => {
            res.send(body)
            });
        // res.send({lat:-32,lng:100});
    },

    getBarChart: function(req, res) {
        dbIncome.view('DesignDoc', 'sumByCity', {
            //'keys':['Melbourne','Brisbane'],
            'group':'true',
        }).then((body) => {
 ;          var num = [];
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
        var  age = {};
        dbAge.view('DesignCity', 'sumByCity_0_4', {
            //'keys':['Melbourne','Brisbane'],
            'group':'true'
        }).then((body) => {
            body.rows.forEach((doc) => {
                age[doc.key].push(doc.value);
            });
        });
        dbAge.view('DesignCity', 'sumByCity_5_9', {
            //'keys':['Melbourne','Brisbane'],
            'group':'true'
        }).then((body) => {
            body.rows.forEach((doc) => {
                age[doc.key].push(doc.value);
            });

        });
        dbAge.view('DesignCity', 'sumByCity_10_14', {
            //'keys':['Melbourne','Brisbane'],
            'group':'true'
        }).then((body) => {
            body.rows.forEach((doc) => {
                age[doc.key].push(doc.value);
            });
            res.send(age);
        });

    }
}
