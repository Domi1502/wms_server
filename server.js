console.log("ahoj");
var express = require("express");
var path = require("path");
var server = new express();

var PORT = 3030;
server.get('/A', function (request, response) {
console.log(request.query);
response.send(request.query);

})
server.listen(PORT, function() {
    console.log("Server listening on port " + PORT + "!")
});

