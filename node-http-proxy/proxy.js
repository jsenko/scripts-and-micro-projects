#!/usr/bin/node

// Scripts that creates an HTTP proxy to intercept and modify requests to a REST service.
// Written for a specific use case (POST & JSON), modify it as you wish

// Install these using npm
var http = require('http');
var request = require('request');
var _ = require('underscore');

// Params
// Actual REST service URL
var REMOTE_URL = "";
// Application will connect to localhost:[LOCAL_PORT]
var LOCAL_PORT = 10080;

// Function that modifies the data, assuming JSON in this case, use underscore to modify the object
var modify = function(data) {

  _(data).each(function(e, i) {
    // do something
  });

  return data;
}

var server = http.createServer(function(req, res) {
  
  if (req.method == 'POST') {
    console.log("Processing POST request.");

    var data = '';  
    req.on('data', function(chunk) {
      data += chunk;
    });
    
    req.on('end', function() { // Request data colleted

      data = JSON.parse(data);	
      console.log("Request: ", data);

      // Forward the request
      request.post({ url: REMOTE_URL, body: data, json: true }, function(e, r, body) {

        console.log("Remote response: ", body);
        body = modify(body);
        console.log("Modified response: ", body);      
        res.writeHead(200, "OK", {'Content-Type': 'application/json'});
        res.write(JSON.stringify(body));
        res.end(); // Respond
      });
    });
    
  } else {
    console.log("Not a POST.");
  }

});
 

console.log("Listening on port ", LOCAL_PORT)
server.listen(LOCAL_PORT);

