module.exports = function(app, express) {

    app.get('/testroute', function (req, res) {
       res.send('testroute');
    });

}