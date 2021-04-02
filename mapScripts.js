
$("#delete").attr("disabled", true);
$("#simplify").attr("disabled", true);

$('[data-toggle="tooltip"]').tooltip();

var map = L.map('map').setView([51.044, -114.07],11);

map.addControl(new L.Control.Fullscreen());

L.tileLayer('https://api.mapbox.com/styles/v1/saidheeraj/ckmzy80lu0lf717pw822syfe1/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: '© <a href="https://apps.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 18,
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoic2FpdmVlcjE5OTYiLCJhIjoiY2ttNXlsb2gyMGl4ZzJvcXNremMzYThuciJ9.gHCefOrtQl5IyKsre0lKKw'


}).addTo(map);
var myLayer = L.geoJSON();
var geojsonFeature;
var coords = [];


function drawline () {

  map.dragging.disable();

  map.addEventListener('mousedown',function(e){

    $("#draw").attr("disabled", true);

    map.addEventListener('mousemove', function(ev) {

       var lat = ev.latlng.lat;
       var lng = ev.latlng.lng;
       var coord = [lng, lat];
       coords.push(coord);

       geojsonFeature = {
           "type": "Feature",
           "geometry": {
             "type": "LineString",
             "coordinates": coords
           }
       };

       myLayer.addData(geojsonFeature);
       myLayer.addTo(map);
    });
  });

  map.on('mouseup',function(e){

    map.removeEventListener('mousemove');
    map.removeEventListener('mousedown');

    map.dragging.enable();
  });

  $('#delete').removeAttr('disabled');
  $('#simplify').removeAttr('disabled');
}


function check (){

  var geojson = turf.multiLineString([coords]);
  var options = {tolerance: 0.01, highQuality: false};
  var simplified = turf.simplify(geojson, options);
  map.removeLayer(myLayer);
  myLayer.clearLayers();
  myLayer.addData(simplified);
  myLayer.addTo(map);
  coords=[];
  $("#simplify").attr("disabled", true);
}

function deleteline (){

  map.removeLayer(myLayer);
  myLayer.clearLayers();
  coords=[];
  $('#draw').removeAttr('disabled');
  $("#simplify").attr("disabled", true);
  $("#delete").attr("disabled", true);
}
