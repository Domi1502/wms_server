console.log("ahoj"); //po spustení server.js sa zobrazí "ahoj"
var express = require("express"); //premenná "express" importuje express package a 
        //volá vrátený objekt na vytvorenie expresnej aplikácie. Potom môžeme získať prístup k vlastnostiam a funkciám aplikačného objektu.
var path = require("path"); //premenná importuje modul path.js a poskytuje spôsob práce s adresármi a cestami súborov
var fs= require("fs"); // premenná "fs" importuje modul fs.js.  Modul File System poskytuje spôsob práce s počítačovým systémom súborov
var server = express(); //var express vytvára expresnú aplikáciu. Funkcia express () je funkcia najvyššej úrovne exportovaná expresným modulom.
                        //vo vnútri súboru server.js sa pridal modul express
var mapnik = require("mapnik"); //premenná "mapnik" importuje mapnik package
var generateImage = require('./generate_img.js'); //premenná "generateImage" importuje (vyžiada) *.js súbor so skriptom na generovanie obrázka mapy  

console.log(generateImage); //zobrazí sa "generateImage"

var PORT = 3045; //Definovanie portu na hostingu. Určuje, na ktorom porte by mal server fungovať.

//funkcia definuje požiadavku (request) a odpoved (response) servera na našu požiadavku
server.get('/wms', function (request, response) { 
    var params=request.query;
    console.log(params);
    if(params.SERVICE ==="WMS" && params.REQUEST === 'GetCapabilities') { //ak sú splnené obe podmienky GetCapabilities vráti XML dokument
        response.sendFile(path.join(__dirname , 'nase_vrstvy.xml'))
     }   else if (params.SERVICE === "WMS" && params.REQUEST === 'GetMap') {  //ak sú splnené obe podmienky GetMap vrátiť obrázok mapy podľa potrieb používateľa
        generateImage(params, response.sendFile.bind(response))
    }   else {
        console.log("nepodporovana metoda") // sa zobrazí ak nie je cyklus dokončený - podmienka nie je splnená
    response.send('nepodporovana metoda') //odpoved servera
}
})
server.listen(PORT, function() {
    console.log("Server listening on port " + PORT + "!")
});

