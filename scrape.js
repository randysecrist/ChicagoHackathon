var https = require('https')


var magic = 7;
json = {}
https.get("https://data.cityofchicago.org/api/views/q3z3-udcz/rows.json?accessType=DOWNLOAD", function(res){
  var data = '';

  res.on('data', function (chunk){
    data += chunk;
  });

  res.on('end',function(){
    var json = JSON.parse(data);
    parse(json);

  })

});


function parse(json) {
  var geoJson = {
    type : "FeatureCollection", features: [],
    crs : { type : "name", properties : { name : "urn:ogc:def:crs:OGC:1.3:CRS84" } }
  };
  var id = 0;
  for( var i in json.data ) {
    var row = json.data[i];

    var pcnt = parseFloat(row[18])/parseFloat(row[17]);
    var pString = (pcnt*100.0).toFixed(1) + "%";
    var geoRow = { type: "Feature", id: id, properties: { "Vegetated Percentage": pString, "marker-symbol": "garden"}, geometry: { type: "Point", "coordinates" : [parseFloat(row[21]), parseFloat(row[20]), 0.0] } };
    geoJson.features.push(geoRow);
    id++;
  }
  var out = JSON.stringify(geoJson);
  console.log(out);
}
