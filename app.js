// index.js
var express = require("express");
var api = require('./api');
var app = express();

app.configure(function() {
  // Parse form data as body
  app.use(express.json());
  app.use(express.urlencoded());
  // Allow put and delete
  app.use(express.methodOverride());
  app.use(app.router);
});

app.use(express.static(__dirname + '/app'));

// Routes
app.get('/api', function(request, response) {
  response.send('Numenera Cypher API is running.');
});

app.get('/api/:noun', function(request, response) {
  api.getResource(request, function(result, statusCode) {
    if(statusCode) {
      response.status(statusCode);
    }
    response.send(result);
  });
});

app.get('/api/:noun/:id', function(request, response) {
  api.getResource(request, function(result, statusCode) {
    if(statusCode) {
      response.status(statusCode);
    }
    response.send(result);
  });
});

app.post('/api/:noun', function(request, response) {
  api.saveResource(request, function(result, statusCode) {
    if(statusCode) {
      response.status(statusCode);
    }
    response.send(result);
  });
});

app.delete('/api/:noun/:id', function(request, response) {
  api.deleteResource(request, function(result, statusCode) {
    if(statusCode) {
      response.status(statusCode);
    }
    response.send(result);
  });
});

app.put('/api/:noun/:id', function(request, response) {
  api.updateResource(request, function(result, statusCode) {
    if(statusCode) {
      response.status(statusCode);
    }
    response.send(result);
  });
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});