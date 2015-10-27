var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');
var connectionString = require(path.join(__dirname, '../', 'config'));

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

//1. get all planets
router.get('/planets', function(req, res) {

    var results = [];

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Select Data
        var query = client.query('SELECT * FROM planets ORDER BY id ASC;');

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);
        });

    });

});

//2. get one planet
router.get('/planet/:planet_id', function(req, res){
    var results = [];

    //1.
    // var data = {id: req.params.planet_id};

    //2.
    var data = req.params.planet_id;
    pg.connect(connectionString, function(err, client, done) {
        if(err) {
            done();
            console.log(err);
            return res.status(500).join({ success:false, data: err});
        }

        //1.
        // var query = client.query('SELECT * FROM planets WHERE id =($1);', [data.id]);

        //2.
        var query = client.query('SELECT * FROM planets WHERE id =($1);', [data]);
        query.on('row', function(row) {
            results.push(row);
        });

        query.on('end', function() {
            done();
            res.json(results);
        });

    });
});

//3. post a planet
router.post('/planets', function(req, res) {

    var results = [];

    // Grab data from http request
    var data = {name: req.body.name};

    // console.log(data);

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Insert Data

        client.query("INSERT INTO planets(name) values($1)", [data.name]);

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM planets ORDER BY id ASC");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);
        });

    });
});

//4. put to update planet
router.put('/planets/:planet_id', function(req, res) {

    var results = [];

    // Grab data from the URL parameters
    var id = req.params.planet_id;

    // Grab data from http request
    var data = {name: req.body.name};

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).send(json({ success: false, data: err}));
        }

        // SQL Query > Update Data
        client.query("UPDATE planets SET name=($1) WHERE id=($2)", [data.name,  id]);

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM planets ORDER BY id ASC");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);
        });
    });

});

//5. delete planet
router.delete('/planets/:planet_id', function(req, res) {

    var results = [];

    // Grab data from the URL parameters
    var id = req.params.planet_id;


    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Delete Data
        client.query("DELETE FROM planets WHERE id=($1)", [id]);

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM planets ORDER BY id ASC");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);
        });
    });

});



module.exports = router;
