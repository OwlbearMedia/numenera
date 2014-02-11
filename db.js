var mongoose = require('mongoose');
var cyphers = require('./cyphers');

function DB() {}

//Connect to database
mongoose.connect('mongodb://localhost/numenera');
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
DB.prototype.connection = mongoose.connection;

// Load Models
DB.prototype.cyphers = cyphers;

var db = module.exports = exports = new DB();