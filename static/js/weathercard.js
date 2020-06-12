//setting the date
    var dateElem = document.getElementById("date");
    var currentDate = new Date();
    dateElem.innerHTML = currentDate.toDateString();

// Select the button
var button = d3.select(".btn");

// Select the form
var form = d3.select(".form");

// Create event handlers 
button.on("click", runEnter);
form.on("submit",runEnter);

// Complete the event handler function for the form
function runEnter() {

    // Prevent the page from refreshing
    d3.event.preventDefault();
    
    // Select the input element and get the raw HTML node
    var inputElement = d3.select("#city");

    // Get the value property of the input element
    var city_name = inputElement.property("value");

    console.log(city_name);

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%5
    var url = `/api/v1.0/weather_data/${city_name}`
    //console.log(url);
    d3.json(url, function(data){
        // data.forEach(d =>console.log(d))
        console.log(data)
    })

    /* Citation for the Weather Card source code which was then modified to suit our need
    %%%%%%%%%%%%%%%%%%%%%%%% add the github url %%%%%%%%%%%%%%%%%%%%%%%%%5555
    Weather App Javascript code
    author: George Louis
    date:   3/11/2018
    purpose: get local weather
    */
    function run() {
        //variables
        var ipUrl = `/api/v1.0/weather_data/${city_name}`;
        //console.log(ipUrl);
        var location = document.getElementById("location");	
        var currentDate = new Date();
        //console.log(currentDate);
        var dayNight = "day";

        //calling flask api function
        httpReqIpAsync(ipUrl);							

        //request to flask api for the city name
        function httpReqIpAsync(url, callback) {
            var httpReqIp = new XMLHttpRequest();
            httpReqIp.open("GET", url, true)
            httpReqIp.onreadystatechange = function() {
                if(httpReqIp.readyState == 4 && httpReqIp.status == 200) {
                    var jsonIp = JSON.parse(httpReqIp.responseText);
                    var city = jsonIp[0].name;
                    location.innerHTML = `${city}`;
                    //calling openweathermap api function
                    httpReqWeatherAsync(ipUrl);
                }
            }
            httpReqIp.send();				
        }
        
        //request to flask api for all the weather variables values
        function httpReqWeatherAsync(url, callback) {
            var httpReqWeather = new XMLHttpRequest();
            httpReqWeather.open("GET", url, true);
            httpReqWeather.onreadystatechange = function() {
                if(httpReqWeather.readyState == 4 && httpReqWeather.status == 200) {
                    var jsonWeather = JSON.parse(httpReqWeather.responseText);
                    //console.log(jsonWeather)
                    const lastItem = jsonWeather.length - 1;
                    //console.log(lastItem);
                    var weatherDesc = jsonWeather[lastItem].weather[0].description;
                    var id = jsonWeather[lastItem].weather[0].id;
                    var icon = `<i class="wi wi-owm-${id}"></i>`
                    var temperature = jsonWeather[lastItem].main.temp;
                    var tempFaren = Math.round(temperature);
                    // console.log(tempFaren)
                    var humidity = jsonWeather[lastItem].main.humidity;
                    var windSpeed = jsonWeather[lastItem].wind.speed; 
                    //converting visibility to miles 
                    var visibility = Math.round(jsonWeather[lastItem].visibility / 1000);
                    // console.log(visibility)
                    var date = jsonWeather[lastItem].dt;
                    console.log(date);

                    //find whether is day or night
                    var sunSet = jsonWeather[lastItem].sys.sunset;
                    //sunset is 10 digits and currentDate 13 so div by 1000
                    var timeNow = Math.round(currentDate / 1000);
                    console.log(timeNow + "<" + sunSet +" = "+(timeNow < sunSet))
                    dayNight = (timeNow < sunSet) ? "day" : "night";
                    //insert into html page
                    var description = document.getElementById("description");
                    description.innerHTML = `<i id="icon-desc" class="wi wi-owm-${dayNight}-${id}"></i><p>${weatherDesc}</p>`;
                    var tempElement = document.getElementById("temperature");
                    tempElement.innerHTML = `${tempFaren}<i id="icon-thermometer" class="wi wi-thermometer"></i>`	;
                    var humidityElem = document.getElementById("humidity");
                    humidityElem.innerHTML = `${humidity}%`;
                    var windElem = document.getElementById("wind");
                    windElem.innerHTML = `${windSpeed} mph`;
                    var visibilityElem = document.getElementById("visibility");
                    visibilityElem.innerHTML = `${visibility} miles`;
                }
            }
            httpReqWeather.send();
        }							
    }
    run();
}