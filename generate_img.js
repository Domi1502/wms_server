// ak sa opakujú prvky komentáre sú písané 1-krát

var path = require("path");
var fs = require("fs");
var mapnik = require("mapnik"); // importuje sa knižnica na vykresľovanie mapy

mapnik.register_default_fonts(); // zaznamená niektoré predvolené fonty do mapniku
mapnik.register_default_input_plugins(); // to isté s pluginmi

function generateImage(arg, sendFile) {
    var width = Number(arg.WIDTH); // šírka obrázku mapy v pixeloch
    var height = Number(arg.HEIGHT); // výška obrázku mapy v pixeloch
    var BBOX = arg.BBOX.split(',').map(function(elem){
        return Number(elem)}); // spodný ľavý roh a vrchný pravý roh rámu ohraničenia obrazu mapy
    var layers=(arg.LAYERS).split(','); // " , " rozdeľuje reťazec tvorený vrstvami na pole podmnožín

var map = new mapnik.Map(width, height);
// vytvorí nový objekt mapy s definovanou šírkou a výškou

var addBudovy=arg.LAYERS.includes('budovy'); // vrstva "budovy" s definovanými vlasnosťami 
var addCesty=arg.LAYERS.includes('cesty');
var addTur_chodniky=arg.LAYERS.includes('Tur_chodniky');
var addKanalizacia=arg.LAYERS.includes('kanalizacia');
var addParkovisko=arg.LAYERS.includes('parkovisko');


var proj = "+proj=krovak +lat_0=49.5 +lon_0=24.83333333333333 +alpha=30.28813972222222 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=589,76,480,0,0,0,0 +units=m +no_defs";
//definovanie projekcie
var style_budovy='<Style name="style_budovy">' + // štylizovanie pre vrstvu "budovy" 
'<Rule>' +
    '<MaxScaleDenominator>32000</MaxScaleDenominator>'+    //maximálny zoom pre zobrazenie nastaveného štylizovania 
    '<MinScaleDenominator>2001</MinScaleDenominator>'+     //minimálny zoom pre zobrazenie nastaveného štylizovania
    '<LineSymbolizer stroke="#08090c" stroke-width="0.1" />' + //štylizovanie línie (farba a šírka čiary)
    '<PolygonSymbolizer fill="#f48942" fill-opacity="0.5" />' + //štylizovanie polygónu (farba a transparentnosť výplne)
'</Rule>' +

'<Rule>' +
'<MaxScaleDenominator>2000</MaxScaleDenominator>'+    
'<MinScaleDenominator>100</MinScaleDenominator>'+   
       '<LineSymbolizer stroke="#08090c" stroke-width="0.1" />' + 
       '<PolygonSymbolizer fill="#e6e8ef" fill-width="0.2" />' + //štylizovanie polygónu (farba a šírka výplne)
'</Rule>' +

'<Rule>' +
'<MaxScaleDenominator>1000</MaxScaleDenominator>'+    
'<MinScaleDenominator>100</MinScaleDenominator>'+  
'<LineSymbolizer stroke="#08090c" stroke-width="0.1" />' + 
'<PolygonSymbolizer fill="#e6e8ef" fill-width="0.2" />' +
'</Rule>' +

'</Style>' 

var style_cesty='<Style name="style_cesty">' +   
'<Rule>' +
'<MaxScaleDenominator>32000</MaxScaleDenominator>'+    
'<MinScaleDenominator>16001</MinScaleDenominator>'+
'<LineSymbolizer stroke="#f4d742" stroke-width="0.8" />' +
'</Rule>' +

'<Rule>' +
'<MaxScaleDenominator>16000</MaxScaleDenominator>'+   
'<MinScaleDenominator>10000</MinScaleDenominator>'+
'<LineSymbolizer stroke="#f4d742" stroke-width="1.5" />' + 
'</Rule>' +

'<Rule>' +
'<MaxScaleDenominator>9999</MaxScaleDenominator>'+   
'<MinScaleDenominator>8001</MinScaleDenominator>'+
    '<LineSymbolizer stroke="#f4d742" stroke-width="1.4" />' + 
   '</Rule>' +

'<Rule>' +
'<MaxScaleDenominator>8000</MaxScaleDenominator>'+    
'<MinScaleDenominator>5000</MinScaleDenominator>'+
    '<LineSymbolizer stroke="#f4d742" stroke-width="1.2" stroke-opacity="0.7" />' + 
'</Rule>' +

'<Rule>' +
'<MaxScaleDenominator>4999</MaxScaleDenominator>'+  
'<MinScaleDenominator>1000</MinScaleDenominator>'+
'<LineSymbolizer stroke="#f4d742" stroke-width="5" stroke-opacity="0.6" />' + 
'</Rule>' +
'<Rule>' +
'<MaxScaleDenominator>999</MaxScaleDenominator>'+  
'<MinScaleDenominator>200</MinScaleDenominator>'+
'<LineSymbolizer stroke="#f4d742" stroke-width="8"  stroke-opacity="0.5"/>' + 
'</Rule>' +

'<Rule>' +
'<MaxScaleDenominator>199</MaxScaleDenominator>'+   
'<MinScaleDenominator>10</MinScaleDenominator>'+
'<LineSymbolizer stroke="#f4d742" stroke-width="15" stroke-opacity="0.5"/>' + 
'</Rule>' +
'</Style>' 

var style_Tur_chodniky='<Style name="style_Tur_chodniky">' +  // // opakuje sa
'<Rule>' +
'<MaxScaleDenominator>16000</MaxScaleDenominator>'+    
'<MinScaleDenominator>10001</MinScaleDenominator>'+
'<LineSymbolizer stroke="#ea3323" stroke-width="0.4" stroke-dasharray="5 2" />' + //štylyzovanie línie (farba, šírka, definovaná dĺžka čiary a medzery v px )
'</Rule>' +

'<Rule>' +
'<MaxScaleDenominator>10000</MaxScaleDenominator>'+    
'<MinScaleDenominator>8001</MinScaleDenominator>'+
'<LineSymbolizer stroke="#ea3323" stroke-width="0.4" stroke-dasharray="5 2" />' +
'</Rule>' +

'<Rule>' +
'<MaxScaleDenominator>8000</MaxScaleDenominator>'+    
'<MinScaleDenominator>5000</MinScaleDenominator>'+
'<LineSymbolizer stroke="#ea3323" stroke-dasharray="5 2" />' +
'</Rule>' +

'<Rule>' +
'<MaxScaleDenominator>4999</MaxScaleDenominator>'+ 
'<MinScaleDenominator>200</MinScaleDenominator>'+
'<LineSymbolizer stroke="#ea3323" stroke-dasharray="5 2" />' +
'<PointSymbolizer spacing="100" file="./turista.jpg" transform="scale(0.09)"/>'+ //načítanie .jpg obrázka ako bodu s definovanou veľkosťou v px
'</Rule>' +
'<Rule>' +
'<MaxScaleDenominator>199</MaxScaleDenominator>'+ 
'<MinScaleDenominator>10</MinScaleDenominator>'+
'<LineSymbolizer stroke="#ea3323" stroke-dasharray="5 2" />' +
'</Rule>' +
'</Style>' 

var style_kanalizacia='<Style name="style_kanalizacia">' + //opakuje sa
'<Rule>' +
'<MaxScaleDenominator>3000</MaxScaleDenominator>' +  
'<MinScaleDenominator>2001</MinScaleDenominator>'+
'<PointSymbolizer file= "./kanalizacia.png" transform="scale(0.03)" />' +
'</Rule>' +     

'<Rule>' +
    '<MaxScaleDenominator>2000</MaxScaleDenominator>' +
    '<MinScaleDenominator>500</MinScaleDenominator>'+
    '<PointSymbolizer file= "./kanalizacia.png" transform="scale(0.022)" />' +
  '</Rule>' +
'<Rule>' +
    '<MaxScaleDenominator>499</MaxScaleDenominator>' +
    '<MinScaleDenominator>200</MinScaleDenominator>'+
    '<PointSymbolizer file= "./kanalizacia.png" transform="scale(0.018)" />' +
   '</Rule>' +
'<Rule>' +
    '<MaxScaleDenominator>199</MaxScaleDenominator>' +
    '<MinScaleDenominator>0.1</MinScaleDenominator>'+
    '<PointSymbolizer file= "./kanalizacia.png" transform="scale(0.015)" />' +
 '</Rule>' +
'</Style>' 

var style_parkovisko='<Style name="style_parkovisko">' +  // opakuje sa
'<Rule>' +
    '<MaxScaleDenominator>5000</MaxScaleDenominator>' +
    '<MinScaleDenominator>2000</MinScaleDenominator>'+
    '<PolygonSymbolizer fill="#1f4b96"  stroke-opacity="0.6" />' +
    '<LineSymbolizer stroke="black" stroke-width="0.03" />' + 
'</Rule>' +  
'<Rule>' +
'<MaxScaleDenominator>1999</MaxScaleDenominator>'+
'<MinScaleDenominator>100</MinScaleDenominator>'+
'<PointSymbolizer spacing="80" file="./parkovanie.jpg" transform="scale(0.1)" stroke-opacity="0.6"/>'+
'</Rule>' +

'<Rule>' +
'<MaxScaleDenominator>99</MaxScaleDenominator>'+
'<MinScaleDenominator>50</MinScaleDenominator>'+
'<PointSymbolizer spacing="80" file="./parkovanie.jpg" transform="scale(0.09)" stroke-opacity="0.6"/>'+
'</Rule>' +
 '</Style>' 


// schémy zobrazenej mapy
var schema = '<Map background-color="transparent" srs="'+proj+'">' + // definujeme farbu pozadia mapy a jej priestorový referenčný systém pomocou kódu epsg použitých údajov
                (addBudovy ? style_budovy : '') + // vrstve "budovy" priradí štylizovanie "style_budovy"
                (addCesty ? style_cesty : '') + // opakuje sa
                (addTur_chodniky ? style_Tur_chodniky : '') +
                (addKanalizacia ? style_kanalizacia : '') +
                (addParkovisko ? style_parkovisko : '') +
                

                '<Layer name="cesty" srs="'+proj+'">' + // vrstva cesty s priestorovým referenčným systémom
                    '<StyleName>style_cesty</StyleName>' + // väzba štýlu použitého pre túto vrstvu => "style_cesty"
                    '<Datasource>' + // definícia zdroja údajov
                        '<Parameter name="file">' + path.join( __dirname, 'data/cesty.shp' ) +'</Parameter>' + // cesta k vrstve "cesty"
                        '<Parameter name="type">shape</Parameter>' + //typ súboru
                    '</Datasource>' +
                '</Layer>' +

                '<Layer name="budovy" srs="'+proj+'">' + // rovnako ako vyššie
                    '<StyleName>style_budovy</StyleName>' +
                    '<Datasource>' +
                        '<Parameter name="file">' + path.join( __dirname, 'data/budovy.shp' ) +'</Parameter>' +
                        '<Parameter name="type">shape</Parameter>' +
                    '</Datasource>' +
                '</Layer>' +

                '<Layer name="Tur_chodniky" srs="'+proj+'">' + // rovnako ako vyššie
                '<StyleName>style_Tur_chodniky</StyleName>' +
                '<Datasource>' + 
                    '<Parameter name="file">' + path.join( __dirname, 'data/Tur_chodniky.shp' ) +'</Parameter>' + 
                    '<Parameter name="type">shape</Parameter>' + 
                '</Datasource>' +
            '</Layer>' +

            '<Layer name="kanalizacia" srs="'+proj+'">' + // rovnako ako vyššie
            '<StyleName>style_kanalizacia</StyleName>' +
            '<Datasource>' +
                '<Parameter name="file">' + path.join( __dirname, 'data/kanalizacia.shp' ) +'</Parameter>' +
                '<Parameter name="type">shape</Parameter>' +
             '</Datasource>' +
            '</Layer>' + 

            '<Layer name="parkovisko" srs="'+proj+'">' +  // rovnako ako vyššie
            '<StyleName>style_parkovisko</StyleName>' + 
            '<Datasource>' + 
                '<Parameter name="file">' + path.join( __dirname, 'data/parkovisko.shp' ) +'</Parameter>' + 
                '<Parameter name="type">shape</Parameter>' + 
            '</Datasource>' +
        '</Layer>' +

            '</Map>';

// teraz máme mapnik xml v premennej schéme, ktorá definuje vrstvy, zdroje údajov a štýly vrstiev

map.fromString(schema, function(err, map) { //používame metódu "fromString" => musíme použiť schému xml v rámci schémy premenných
  if (err) {
      console.log('Map Schema Error: ' + err.message) // ak sa vyskytne chyba pri spracovaní schém, vypíše ju
  }
  map.zoomToBox(BBOX); // Priblíženie mapy mapníka k ohraničeniu uloženému v premennej BBOX

  var im = new mapnik.Image(width, height); // definuje nový mapnikový obrázok s rovnakou šírkou a výškou ako naša mapa

  map.render(im, function(err, im) { // urobí mapu do mapnikového obrázku uloženého v premennej "im"
      
    if (err) {
        console.log('Map redner Error: ' + err.message) // ak sa vyskytne chyba vypíše ju
    }

    im.encode("png", function(err, buffer) { // vloží náš obrázok do "png"
      if (err) {
         console.log('Encode Error: ' + err.message) // to isté 
      }

      fs.writeFile( // použitie balíčka súborového systému "fs" na zápis do súboru, prvým parametrom je cesta k nášmu súboru
        path.join(__dirname, "out/map.png"), // skombinujte adresár nášho bežiaceho skriptu a požadovaného obrázka mapy

        buffer, // vloží vyrovnávaciu pamäť obrázkov vytvorenú metódou "im.encode" mapy mapníka

        function(err) {
          if (err) {
              console.log(' Fs Write Error: ' + err.message) // to isté 
          }
          console.log('Image generated into: ' + 
            path.join(__dirname, "out/map.png") // našu mapu a uloží do zadanej cesty, keď je obrázok vygenerovaný ako"map.png"
            // po vygenerovaní správy "Image generated into..." môžeme otvoriť vygenerovaný obrázok
            // zmeniť ohraničenie, šírku, výšku a štýl, ak chcete

          );
          sendFile(path.join(__dirname ,"out/map.png"));
        }
      );
    });
  });
})
};

module.exports = generateImage;