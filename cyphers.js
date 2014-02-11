var mongoose = require('mongoose');

function Cyphers() {}

var cypherSchema = new mongoose.Schema({
  id: Number,
  name: String,
  level: String,
  form: [String],
  effect: String,
  book: String,
  page: Number 
});
Cyphers.prototype.schema = cypherSchema;

// Model.
var Cypher = mongoose.model('Cypher', cypherSchema);
Cyphers.prototype.model = Cypher;

// Save.
Cyphers.prototype.save = function(object, callback) {
  var temp = new this.model(object);
  temp.save(function(error, temp) {
    callback(error, temp);
  });
};

// Get Collection.
Cyphers.prototype.get = function(conditions, callback) {
  var temp = this.model.find(conditions, function(error, docs) {
    callback(error, docs);
  });
};

// Get One.
Cyphers.prototype.getOne = function(conditions, callback) {
  var temp = this.model.findOne(conditions, function(error, docs) {
    callback(error, docs);
  });
};

// Update.
Cyphers.prototype.update = function(conditions, update, callback) {
  this.model.update(conditions, update, function(error, numberAffected, rawResponse) {
    callback(error, numberAffected + ' document(s) updated.');
  });
};

// Remove.
Cyphers.prototype.remove = function(conditions, callback) {
  var temp = this.model.find(conditions);
  temp.remove(function(error) {
    callback(error, temp);
  });
};

var cyphers = module.exports = exports = new Cyphers();