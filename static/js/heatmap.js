var url = "/api/v1.0/weather_data";

d3.json(url, function(response){
  console.log(response);

  var heatArray = [];

  response.forEach(data => {
    var coordinates = data.coord;
    var dateMonth = (new Date(data.dt*1000)).getMonth();
    var dateDay = (new Date(data.dt*1000)).getDate();

    var country = data.sys.country;
    var temperature = data.main.temp;
    var windSpeed = data.wind.speed;
    var windDegree = data.wind.deg;
    if (dateDay == 6) {
    if (country == "US") {
      if (coordinates) {
        for (var j = 0; j < temperature; j++){
          heatArray.push([coordinates.lat, coordinates.lon])        }
      }
    }
  }
  });
  
  var heatMap = L.heatLayer(heatArray, {
    radius: 20,
    blur: 35
  })//.addTo(myMap)


var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox/satellite-v9",
  accessToken: API_KEY  
});
var grayscaleMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox/light-v10",
  accessToken: API_KEY  
});
var outdoorsMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox/outdoors-v11",
  accessToken: API_KEY  
});

var baseMaps = {
  "Satellite": satelliteMap,
  "Grayscale": grayscaleMap,
  "Outdoors": outdoorsMap
}

var overlayMaps = {
  "Temperature": heatMap
};

var myMap = L.map("map", {
  center: [39.8283, -98.5795],
  zoom: 5,
  layers: [grayscaleMap, heatMap]
});
L.control.layers(baseMaps, overlayMaps, {
  collapsed: true
}).addTo(myMap);


});



city_name = "New York";
var url = `/api/v1.0/weather_data/${city_name}`
console.log(url);
d3.json(url, function(response){
    // data.forEach(d =>console.log(d))
    console.log(response)
})

