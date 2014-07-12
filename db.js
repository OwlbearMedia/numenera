var mongoose = require('mongoose');
var cyphers = require('./cyphers');

function DB() {}

//Connect to database
var mongoUri = 'mongodb://dylan:Trotsky1879@ds053449.mongolab.com:53449/heroku_app27352287';
mongoose.connect(mongoUri);
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
DB.prototype.connection = mongoose.connection;

// Load Models
DB.prototype.cyphers = cyphers;

var db = module.exports = exports = new DB();