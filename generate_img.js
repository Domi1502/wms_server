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

var proj = "+proj=krovak +lat_0=49.5 +lon_0=24.83333333333333 +alpha=30.28813972222222 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=589,76,480,0,0,0,0 +units=m +no_defs";

var addBudovy=arg.LAYERS.includes('budovy');
var addCesty=arg.LAYERS.includes('cesty');

var style_Budovy='<Style name="styl_pre_vrstvu_budovy">' + // style for layer Budovy
'<Rule>' +
    '<LineSymbolizer stroke="black" stroke-width="0.1" />' + // style for lines
    '<PolygonSymbolizer fill="#f2cfaf"  />' + // style for polygons
'</Rule>' +
'</Style>' 

var style_Cesty='<Style name="styl_pre_vrstvu_cesty">' + // style for layer "style_cesty"
'<Rule>' +
    '<LineSymbolizer stroke="#d7c8b9" stroke-width="0.8" />' + // style for lines
'</Rule>' +
'</Style>' 

// schema of the rendered map
var schema = '<Map background-color="transparent" srs="'+proj+'">' + // we define background color of the map and its spatial reference system with epsg code of data used
                (addBudovy ? style_Budovy : '') +
                (addCesty ? style_Cesty : '') +

                '<Layer name="Cesty" srs="'+proj+'">' + // layer "cesty" with spatial reference system
                    '<StyleName>styl_vrstvy_cesty</StyleName>' + // binding of a style used for this layer => "style_cesty"
                    '<Datasource>' + // definition of a data source
                        '<Parameter name="file">' + path.join( __dirname, 'data/cesty.shp' ) +'</Parameter>' + // path to the data file
                        '<Parameter name="type">shape</Parameter>' + // file type
                    '</Datasource>' +
                '</Layer>' +
                '<Layer name="budovy" srs="'+proj+'">' + // same as above
                    '<StyleName>styl_vrstvy_budovy</StyleName>' +
                    '<Datasource>' +
                        '<Parameter name="file">' + path.join( __dirname, 'data/budovy.shp' ) +'</Parameter>' +
                        '<Parameter name="type">shape</Parameter>' +
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