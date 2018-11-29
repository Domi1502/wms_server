var path = require("path");
var fs = require("fs");
var mapnik = require("mapnik"); // lib for map rendering

mapnik.register_default_fonts(); // register some default fonts into mapnik
mapnik.register_default_input_plugins(); // same with plugins

function generateImage(arg, sendFile) {
    var width = Number(arg.WIDTH); // with of map image in pixels
    var height = Number(arg.HEIGHT); // height -||-
    var BBOX = arg.BBOX.split(',').map(function(elem){
        return Number(elem)}); // bottom left corner coords and top right corner coords of the image 
    var layers=(arg.LAYERS).split(',');

var map = new mapnik.Map(width, height);
// create new map object with defined width and height

var addBudovy=arg.LAYERS.includes('budovy');
var addCesty=arg.LAYERS.includes('cesty');
var addTur_chodniky=arg.LAYERS.includes('Tur_chodniky');
var addKanalizacia=arg.LAYERS.includes('kanalizacia');
var addParkovisko=arg.LAYERS.includes('parkovisko');


var proj = "+proj=krovak +lat_0=49.5 +lon_0=24.83333333333333 +alpha=30.28813972222222 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=589,76,480,0,0,0,0 +units=m +no_defs";

var style_budovy='<Style name="style_budovy">' + // style for layer Budovy
'<Rule>' +
    '<MaxScaleDenominator>32000</MaxScaleDenominator>'+    
    '<MinScaleDenominator>2001</MinScaleDenominator>'+
    '<LineSymbolizer stroke="#08090c" stroke-width="0.1" />' + // style for lines
    '<PolygonSymbolizer fill="#f48942" fill-opacity="0.5" />' + // style for polygons
'</Rule>' +

'<Rule>' +
'<MaxScaleDenominator>2000</MaxScaleDenominator>'+    
'<MinScaleDenominator>100</MinScaleDenominator>'+   
       '<LineSymbolizer stroke="#08090c" stroke-width="0.1" />' + // style for lines
       '<PolygonSymbolizer fill="#e6e8ef" fill-width="0.2" />' + // style for polygons
'</Rule>' +

'<Rule>' +
'<MaxScaleDenominator>1000</MaxScaleDenominator>'+    
'<MinScaleDenominator>100</MinScaleDenominator>'+  
'<LineSymbolizer stroke="#08090c" stroke-width="0.1" />' + // style for lines
'<PolygonSymbolizer fill="#e6e8ef" fill-width="0.2" />' + // style for polygons 
'</Rule>' +

'</Style>' 

var style_cesty='<Style name="style_cesty">' + // style for layer "style_cesty"
'<Rule>' +
'<MaxScaleDenominator>32000</MaxScaleDenominator>'+    
'<MinScaleDenominator>16001</MinScaleDenominator>'+
    '<LineSymbolizer stroke="#f4d742" stroke-width="0.8" />' + // style for lines
'</Rule>' +

'<Rule>' +
'<MaxScaleDenominator>16000</MaxScaleDenominator>'+    
'<MinScaleDenominator>10000</MinScaleDenominator>'+
    '<LineSymbolizer stroke="#f4d742" stroke-width="1.5" />' + // style for lines
'</Rule>' +

'<Rule>' +
'<MaxScaleDenominator>9999</MaxScaleDenominator>'+    
'<MinScaleDenominator>8001</MinScaleDenominator>'+
    '<LineSymbolizer stroke="#f4d742" stroke-width="1.4" />' + // style for lines
   '</Rule>' +

'<Rule>' +
'<MaxScaleDenominator>8000</MaxScaleDenominator>'+    
'<MinScaleDenominator>5000</MinScaleDenominator>'+
    '<LineSymbolizer stroke="#f4d742" stroke-width="1.2" stroke-opacity="0.7" />' + // style for lines
'</Rule>' +

'<Rule>' +
'<MaxScaleDenominator>4999</MaxScaleDenominator>'+
'<MinScaleDenominator>1000</MinScaleDenominator>'+
'<LineSymbolizer stroke="#f4d742" stroke-width="5" stroke-opacity="0.6" />' + // style for lines
'</Rule>' +
'<Rule>' +
'<MaxScaleDenominator>999</MaxScaleDenominator>'+
'<MinScaleDenominator>200</MinScaleDenominator>'+
'<LineSymbolizer stroke="#f4d742" stroke-width="8"  stroke-opacity="0.5"/>' + // style for lines
'</Rule>' +

'<Rule>' +
'<MaxScaleDenominator>199</MaxScaleDenominator>'+
'<MinScaleDenominator>10</MinScaleDenominator>'+
'<LineSymbolizer stroke="#f4d742" stroke-width="15" stroke-opacity="0.5"/>' + // style for lines
'</Rule>' +
'</Style>' 

var style_Tur_chodniky='<Style name="style_Tur_chodniky">' + // style for layer "style_Tur_chodniky"
'<Rule>' +
'<MaxScaleDenominator>16000</MaxScaleDenominator>'+    
'<MinScaleDenominator>10001</MinScaleDenominator>'+
'<LineSymbolizer stroke="#ea3323" stroke-width="0.4" stroke-dasharray="5 2" />' +
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
'<PointSymbolizer spacing="100" file="./turista.jpg" transform="scale(0.09)"/>'+
'</Rule>' +
'<Rule>' +
'<MaxScaleDenominator>199</MaxScaleDenominator>'+
'<MinScaleDenominator>10</MinScaleDenominator>'+
'<LineSymbolizer stroke="#ea3323" stroke-dasharray="5 2" />' +
'</Rule>' +
'</Style>' 

var style_kanalizacia='<Style name="style_kanalizacia">' + // style for layer "style_kostol"
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

var style_parkovisko='<Style name="style_parkovisko">' + // style for layer "style_odpad"
'<Rule>' +
    '<MaxScaleDenominator>5000</MaxScaleDenominator>' +
    '<MinScaleDenominator>2000</MinScaleDenominator>'+
    '<PolygonSymbolizer fill="#1f4b96"  stroke-opacity="0.6" />' + // style for polygons
    '<LineSymbolizer stroke="black" stroke-width="0.03" />' + // style for lines
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


// schema of the rendered map
var schema = '<Map background-color="transparent" srs="'+proj+'">' + // we define background color of the map and its spatial reference system with epsg code of data used
                (addBudovy ? style_budovy : '') +
                (addCesty ? style_cesty : '') +
                (addTur_chodniky ? style_Tur_chodniky : '') +
                (addKanalizacia ? style_kanalizacia : '') +
                (addParkovisko ? style_parkovisko : '') +
                

                '<Layer name="cesty" srs="'+proj+'">' + // layer "cesty" with spatial reference system
                    '<StyleName>style_cesty</StyleName>' + // binding of a style used for this layer => "style_cesty"
                    '<Datasource>' + // definition of a data source
                        '<Parameter name="file">' + path.join( __dirname, 'data/cesty.shp' ) +'</Parameter>' + // path to the data file
                        '<Parameter name="type">shape</Parameter>' + // file type
                    '</Datasource>' +
                '</Layer>' +

                '<Layer name="budovy" srs="'+proj+'">' + // same as above
                    '<StyleName>style_budovy</StyleName>' +
                    '<Datasource>' +
                        '<Parameter name="file">' + path.join( __dirname, 'data/budovy.shp' ) +'</Parameter>' +
                        '<Parameter name="type">shape</Parameter>' +
                    '</Datasource>' +
                '</Layer>' +

                '<Layer name="Tur_chodniky" srs="'+proj+'">' + // layer "cesty" with spatial reference system
                '<StyleName>style_Tur_chodniky</StyleName>' + // binding of a style used for this layer => "style_cesty"
                '<Datasource>' + // definition of a data source
                    '<Parameter name="file">' + path.join( __dirname, 'data/Tur_chodniky.shp' ) +'</Parameter>' + // path to the data file
                    '<Parameter name="type">shape</Parameter>' + // file type
                '</Datasource>' +
            '</Layer>' +

            '<Layer name="kanalizacia" srs="'+proj+'">' + // same as above
            '<StyleName>style_kanalizacia</StyleName>' +
            '<Datasource>' +
                '<Parameter name="file">' + path.join( __dirname, 'data/kanalizacia.shp' ) +'</Parameter>' +
                '<Parameter name="type">shape</Parameter>' +
             '</Datasource>' +
            '</Layer>' + 

            '<Layer name="parkovisko" srs="'+proj+'">' + // layer "cesty" with spatial reference system
            '<StyleName>style_parkovisko</StyleName>' + // binding of a style used for this layer => "style_cesty"
            '<Datasource>' + // definition of a data source
                '<Parameter name="file">' + path.join( __dirname, 'data/parkovisko.shp' ) +'</Parameter>' + // path to the data file
                '<Parameter name="type">shape</Parameter>' + // file type
            '</Datasource>' +
        '</Layer>' +

            '</Map>';

// now we have a mapnik xml in variable schema that defines layers, data sources and styles of the layers

map.fromString(schema, function(err, map) { // we use method "fromString" => we need to use the xml schema inside variable schema
  if (err) {
      console.log('Map Schema Error: ' + err.message) // if there is an error in schema processing we print it out
  }
  map.zoomToBox(BBOX); // let's zoom our mapnik map to bounding box stored in BBOX variable

  var im = new mapnik.Image(width, height); // we define new mapnik image with the same width and height as our map

  map.render(im, function(err, im) { // render the map into mapnik image stored in variable "im"
      
    if (err) {
        console.log('Map redner Error: ' + err.message) // print an error if it occures
    }

    im.encode("png", function(err, buffer) { // encoude our image into "png"
      if (err) {
         console.log('Encode Error: ' + err.message) // same same
      }

      fs.writeFile( // we ouse node file system package "fs" to write into file, first parameter is path to our file
        path.join(__dirname, "out/map.png"), // combine directory of our running script and desired map image
        buffer, // insert the image buffer created by "im.encode" method of mapnik image
        function(err) {
          if (err) {
              console.log(' Fs Write Error: ' + err.message) // same same
          }
          console.log('Image generated into: ' + 
            path.join(__dirname, "out/map.png") // we print our path to created image when the image is all writen into "map.png"
            // after the "Image generated into..." message is out, we can open our generated image
            // change the bounding box, width, height and style if you want
          );
          sendFile(path.join(__dirname ,"out/map.png"));
        }
      );
    });
  });
})
};

module.exports = generateImage;