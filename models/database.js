var pg = require('pg');
var path = require('path');
// var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/crud-six';
var connectionString = require(path.join(__dirname,'../', 'config'));

var client = new pg.Client(connectionString);
client.connect();
var query = client.query('CREATE TABLE planets(id SERIAL PRIMARY KEY, name VARCHAR(40) not null)');
query.on('end', function() { client.end(); });
