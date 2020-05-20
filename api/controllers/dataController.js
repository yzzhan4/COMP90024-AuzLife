// Test with local couchdb
const nano = require('nano')('http://admin:yosoro@localhost:5984')
const tweetsdb = nano.use('new');

module.exports = {
    getTweets: function(req, res) {
        tweetsdb.list().then((body) => {
            res.send(body["rows"])
        });
    },

    // test sending coordinate for initializing map
    getTestLoc: function(req, res) {
        res.send({'long':100, 'lat':-32});
    }
}