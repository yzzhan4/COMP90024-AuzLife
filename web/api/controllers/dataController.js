// var couchdbConnection = require("./couchdbConnection.js");
// Test with local couchdb
// const nano = require('nano')('http://admin:90024@172.26.131.147:5984')
// const tweetsdb = nano.use('streaming-userids');
const nano = require('nano')('http://admin:90024@172.26.134.71:5984');
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
};
var cityName = {
    "1": "Melbourne",
    "2": "Sydney",
    "3": "Brisbane",
    "4": "Gold Coast",
    "5": "Adelaide",
    "6": "Perth",
    "7": "Canberra",
    "9": "New South Wales Other Regions",
    "10": "Victoria Other Regions",
    "11": "Queensland Other Regions",
    "12": "South Australia Other Regions",
    "13": "Tasmania Other Regions",
    "14": "Western Australia Other Regions",
    "15": "Northern Territory Other Regions",
    "99": "und"
};

var cityCode = {
    "Melbourne": "1",
    "Sydney": "2",
    "Brisbane": "3" ,
    "Gold Coast": "4",
    "Adelaide": "5",
    "Perth": "6",
    "Canberra": "7",
    "New South Wales Other Regions": "9",
    "Victoria Other Regions": "10",
    "Queensland Other Regions": "11",
    "South Australia Other Regions": "12",
    "Tasmania Other Regions": "13",
    "Western Australia Other Regions": "14",
    "Northern Territory Other Regions": "15",
    "und": "99"
};

var sRegion = {'ACT': 1, 'NSW': 28, 'NT': 2, 'QLD': 19, 'SA': 7, 'TAS': 4, 'VIC': 17, 'WA': 10};

var cRegion = {'Adelaide': 4, 'Brisbane': 5, 'Canberra': 1, 'Gold Coast': 1, 'Melbourne': 8, 'New South Wales Other Regions': 14, 'Northern Territory Other Regions': 2, 'Perth': 5, 'Queensland Other Regions': 13, 'South Australia Other Regions': 3, 'Sydney': 14, 'Tasmania Other Regions': 4, 'Victoria Other Regions': 9, 'Western Australia Other Regions': 5};

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

    // Cities
    // pie (age)
    getAgeOneCity: function(req, res) {
        // TODO
        var code = req.body["region"];
        //console.log(code);
        dbAge.view('DesignCity', 'sumByCity_All', {
            'keys': [code],
            'group':'true'
        }).then((body) => {
            //console.log(body.rows[0]);
            res.send(body.rows[0]);
        });
    },

    // pie (language)
    getLangOneCity: function(req, res) {
        var code = req.body["region"];
        //var states = [stateCodes[code]];
        dbTest.view('DesignDoc', 'countLangCity', {
            'group':'true',
            'stale':'update_after'
        }).then((body) => {
            //res.send(body.rows)
            var langInCity = [];
            langInCity = [{value: 0, name: "Others"}];

            body.rows.forEach((doc) => {
                //console.log(cityCode[doc.key[0]]);
                if (doc.key[0] == code){ //doc.key[0] == req.state改成你的req
                    if(doc.value > 10 && doc.key[1] !== "und") {
                        langInCity.push({value: doc.value, name:doc.key[1]});
                        // console.log(langInState[doc.key[0]]);
                    } else{
                        langInCity[0].value += doc.value;
                        // console.log(langInState[doc.key[0]]);
                    }
                }
            });
            res.send({key: cityName[code], value: langInCity});
        });
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
                if (cityCode[doc.key] <10){
                    name.push(doc.key);
                    num.push(doc.value/cRegion[doc.key]);
                }
            });
            // res.send([num, name]);
        });

        dbTest.view('DesignDoc', 'countByCity', {
            'keys':[[1,1],[1,2],[1,3],[1,4],[1,5],[1,6],[1,7],[1,8],[1,9]],
            'group':'true',
            'stale':'update_after'
            //'stale':'ok'
        }).then((body) => {
            var tweets = {};
            var count = [];
            body.rows.forEach((doc) => {
                // console.log(cityName[doc.key[1]]);
                tweets[doc.key[1]] = doc.value;
            });

            name.forEach((region) => {
                // console.log(tweets[cityCode[region]]);
                count.push(tweets[cityCode[region]])
            });
            res.send([name, num, count]);
        });
    },

    // line
    getEduAllCities: function(req, res) {
        dbEdu.view('DesignDoc', 'sumByCity_All', {
            'keys':[ "Melbourne", "Sydney", "Brisbane", "Gold Coast", "Adelaide", "Perth", "Canberra", "New South Wales Other Regions"],
            'group':'true'
        }).then((body) => {
            var datalist = [];
            body.rows.forEach((doc) => {
                datalist.push({name: doc.key, type: 'line', data: doc.value.slice(0, 5)});
            });
            res.send(datalist)

        });
        // TODO: error handling
        // });
    },

    // State
    // pie (age)
    getAgeOneState: function (req, res){
        //var states = ["VIC"];
        var code = [4]//req.body["region"];
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

    // pie (language)
    getLangOneState: function(req, res) {

        var code = req.body["region"];
        var states = [stateCodes[code]];
        dbTest.view('DesignDoc', 'countLangState', {
            'group':'true',
            'stale':'update_after'
        }).then((body) => {
            //res.send(body.rows)
            var langInState = [];
            langInState = [{value: 0, name: "Others"}];
            // langInState = {NSW: [{value: 0, name: "Others"}],
            //     VIC:[{value: 0, name: "Others"}],
            //     QLD:[{value: 0, name: "Others"}],
            //     SA:[{value: 0, name: "Others"}],
            //     WA:[{value: 0, name: "Others"}],
            //     TAS:[{value: 0, name: "Others"}],
            //     NT:[{value: 0, name: "Others"}],
            //     ACT:[{value: 0, name: "Others"}],};

            body.rows.forEach((doc) => {
                //console.log(stateCodes[code] == doc.key[0]);
                if (doc.key[0] == stateCodes[code]){ //doc.key[0] == req.state改成你的req
                    if(doc.value > 10 && doc.key[1] !== "und") {
                        langInState.push({value: doc.value, name:doc.key[1]});
                        // console.log(langInState[doc.key[0]]);
                    } else{
                        langInState[0].value += doc.value;
                        // console.log(langInState[doc.key[0]]);
                    }
                }
            });
            res.send({key: states[0], value: langInState});
        });
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
                num.push(doc.value/sRegion[doc.key]);
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
            res.send([name,num,count]);
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
    }

}
