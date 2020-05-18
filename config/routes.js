module.exports = function(app, express, db) {

    app.get('/testroute', function (req, res) {
        db.get('users').then((body) => {
            res.send(body);
        })

    });

}