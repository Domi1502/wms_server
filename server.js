console.log("ahoj");
var express = require("express");
var path = require("path");
var server = express();

var generateImage = require('./generate_imag.js');

console.log(generateImage);

var PORT = 3045;

server.get('/wms', function (request, response) {
    var params=request.query;
    console.log(params);
    if(params.SERVICE ==="WMS" && params.REQUEST === 'GetCapabilities') {
        response.sendFile(path.join(__dirname , 'nase_vrstvy.xml'))
     }   else if (params.service === "wms" && params.request === 'GetMap') {
        generateImage(params, response.sendFile.bind(response))
    }   else {
    response.send('nepodporovana metoda')
}
})
server.listen(PORT, function() {
    console.log("Server listening on port " + PORT + "!")
});

