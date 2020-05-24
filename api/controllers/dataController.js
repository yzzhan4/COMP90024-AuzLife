// Test with local couchdb
const nano = require('nano')('http://admin:90024@172.26.131.147:5984')
const tweetsdb = nano.use('streaming-userids');

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
    }
}