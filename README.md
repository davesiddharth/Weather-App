# Weather App

## Objective:

To build an interactive dashboard allowing the user to search for 1000 US cities and visualize:

1. A weather card showing its present day weather.
2. A scatter plot showing last 7 days of temperature, humidity and pressure. (interactive chart)
3. Interactive leaflet map showing the wind vector for the selected city.
4. Interactive leaflet map showing the head map of all the 1000 cities of US.

Project Start Date: 6th June 2020

Project End Date: 13th June 2020

#### Data Source: 

- Open Weather API (https://openweathermap.org/api)

#### Data Storage:

- Response from the API stored in MongoDB
- MongoDB Atlas, a cloud based database used to store the database created using Weather API which is hosted on AWS cloud.

#### Data Access vis Flask app:
- @app.route("/"): to render the html page contarining the visualizations
- @app.route("api/v1.0/weather_data"): to access the entie data on the database
- @app.route("api/v1.0/weather_data/<city_name>"): to access the data corresponding to specific cities

#### App Visuals:

![](images/weather_card.png)

![](images/scatter_plot.png)

![](images/leaflet_map_wind.png)

![](images/leaflet_map_temp.png)

![](images/website_demo.png)