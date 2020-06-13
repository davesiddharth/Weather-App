// var url = "/api/v1.0/weather_data";

// d3.json(url, function(response){
//   //console.log(response);

//   var heatArray = [];

//   response.forEach(data => {
//     var coordinates = data.coord;
//     var dateMonth = (new Date(data.dt*1000)).getMonth();
//     var dateDay = (new Date(data.dt*1000)).getDate();

//     var country = data.sys.country;
//     var temperature = data.main.temp;
//     var windSpeed = data.wind.speed;
//     var windDegree = data.wind.deg;
//     if (dateDay == 6) {
//     if (country == "US") {
//       if (coordinates) {
//         for (var j = 0; j < temperature*5; j++){
//           heatArray.push([coordinates.lat, coordinates.lon])        }
//       }
//     }
//   }
//   });
  
//   var heatMap = L.heatLayer(heatArray, {
//     radius: 20,
//     blur: 35
//   })//.addTo(myMap)


// var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//   maxZoom: 18,
//   id: "mapbox/satellite-v9",
//   accessToken: API_KEY  
// });
// var grayscaleMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//   maxZoom: 18,
//   id: "mapbox/light-v10",
//   accessToken: API_KEY  
// });
// var outdoorsMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//   maxZoom: 18,
//   id: "mapbox/outdoors-v11",
//   accessToken: API_KEY  
// });

// var baseMaps = {
//   "Satellite": satelliteMap,
//   "Grayscale": grayscaleMap,
//   "Outdoors": outdoorsMap
// }

// var overlayMaps = {
//   "Temperature": heatMap
// };

// var myMap = L.map("map", {
//   center: [39.8283, -98.5795],
//   zoom: 5,
//   layers: [grayscaleMap, heatMap]
// });
// L.control.layers(baseMaps, overlayMaps, {
//   collapsed: true
// }).addTo(myMap);


// });



// city_name = "New York";
// var url = `/api/v1.0/weather_data/${city_name}`
// //console.log(url);
// d3.json(url, function(response){
//     // data.forEach(d =>console.log(d))
//     //console.log(response)
// })

//////////////////////////////// Temp heatmap + wind vectors ///////////////////////////////////////

// obtain the api created using flask
var url = "/api/v1.0/weather_data";

d3.json(url, function(response){
  console.log(response);
// create an empty heat array to hold the values
  var heatArray = [];
  var cityArray = [];
  var windArray = [];
  var cityCount = 0;

// generate a heat map for the lastest day 
  response.forEach(data => {
    var cityName = data.name;
    if (cityName == "New York") {
      cityArray.push(data);
      cityCount += 1;
    }
  });  
  console.log(cityArray[cityCount-1])
  var lastMonth = (new Date(cityArray[cityCount-1].dt*1000)).getMonth();
  var lastDay = (new Date(cityArray[cityCount-1].dt*1000)).getDate();

  response.forEach(data => {
    var coordinates = data.coord;
    var dateMonth = (new Date(data.dt*1000)).getMonth();
    var dateDay = (new Date(data.dt*1000)).getDate();

    var country = data.sys.country;
    var temperature = data.main.temp;
    var windSpeed = data.wind.speed;
    var windDegree = data.wind.deg;

    if (dateDay == lastDay & dateMonth == lastMonth) {
      if (country == "US") {
        if (coordinates) {
          windArray.push([coordinates.lat, coordinates.lon, windSpeed, windDegree]);
          for (var j = 0; j < temperature; j++){
            heatArray.push([coordinates.lat, coordinates.lon])}
          }
      }
    }  
  });  

  // crate a initial markers map based on "New York"
  var cityInfo = cityArray[cityCount-1]
  var cityTemp = cityInfo.main.temp;
  var cityCoordinates = cityInfo.coord;
  var markerMap = L.marker([cityCoordinates.lat, cityCoordinates.lon])
    .bindPopup(`<h4> ${cityInfo.name} </h4> <hr> <p>Temperature: ${cityTemp} <hr> Wind Speed and Degree: ${cityInfo.wind.speed}mph at ${cityInfo.wind.deg} <hr>Humidity: ${cityInfo.main.humidity}% </p>`)
  // update the markerMap based on users input 



  var heatMap = L.heatLayer(heatArray, {
    radius: 20,
    blur: 35
  })//.addTo(myMap)
  var windLine = [];
  console.log(Math.cos(0.6));
  console.log(windArray);
  
  // arrows for the wind speed 
  windArray.forEach(windData => {
    windLat = windData[0];
    windLon = windData[1];
    windSpeed = windData[2];
    windDegree = windData[3];
    point1 = [windLat, windLon];
    point2 = [(windLat + windSpeed/50 * Math.cos(windDegree*3.14/180)), (windLon + windSpeed/50*(Math.sin(windDegree*3.14/180)))];
    point3 = [(windLat - windSpeed/10 * Math.cos((windDegree+30)*3.14/180)), (windLon - windSpeed/10*(Math.sin((windDegree+30)*3.14/180)))];
    windLine.push([point1, point2, point3])
  });

  var windMap = L.polyline(windLine, {
    color: "blue"
  });



  var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 10,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY  
  });
  var grayscaleMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 10,
    id: "mapbox/light-v10",
    accessToken: API_KEY  
  });
  var outdoorsMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 10,
    id: "mapbox/outdoors-v11",
    accessToken: API_KEY  
  });

  var baseMaps = {
    "Satellite": satelliteMap,
    "Grayscale": grayscaleMap,
    "Outdoors": outdoorsMap
  }

  var overlayMaps = {
    "Temperature": heatMap,
    "Marker": markerMap,
    "Wind": windMap

  };

  var myMap = L.map("map", {
    center: [39.8283, -98.5795],
    zoom: 4.5,
    layers: [grayscaleMap, heatMap, markerMap]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: true
  }).addTo(myMap);

  });