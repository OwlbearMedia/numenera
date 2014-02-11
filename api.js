// Module dependencies.
var db = require('./db'),
    error = require('./error'),
    status = require('./status');

function API() {}

API.prototype.getResource = function(request, callback) {
  if(db[request.params.noun] && request.params.id) {
    db[request.params.noun].getOne({id: request.params.id}, function(err, result) {
      if(err) {
        callback(err);
      } else if(!result) {
        callback(error.notFound(), 404);
      } else {
        callback(result);
      }
    });
  } else if(db[request.params.noun]) {
    db[request.params.noun].get(function(err, result) {
      if(err) {
        callback(err);
      } else if(!result) {
        callback(error.notFound(), 404);
      } else {
        callback(result);
      }
    });
  } else {
    callback(error.badRequest(), 400);
  }
};

API.prototype.saveResource = function(request, callback) {
  if(db[request.params.noun]) {
    db[request.params.noun].save(request.body, function(err, result) {
      if(err) {
        callback(err);
      } else {
        callback(result, 201);
      }
    });
  } else {
    callback(error.badRequest(), 400);
  }
};

API.prototype.updateResource = function(request, callback) {
  if(db[request.params.noun] && request.params.id) {
    db[request.params.noun].update({id: request.params.id}, request.body, function(err, result) {
      if(err) {
        callback(err);
      } else {
        callback(result);
      }
    });
  } else {
    callback(error.badRequest(), 400);
  }
};

API.prototype.deleteResource = function(request, callback) {
  if(db[request.params.noun] && request.params.id) {
    db[request.params.noun].remove({_id: request.params.id}, function(err) {
      if(err) {
        callback(err);
      } else {
        callback(status.deleted());
      }
    });
  } else {
    callback(error.badRequest(), 400);
  }
};

var api = module.exports = exports = new API();