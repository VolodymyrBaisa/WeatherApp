# HW-WeatherApp

## Description

In this app, the user enters the name of a city (either just the city name, or "city, state") in the search field, then clicks the search button. The app will display the current weather conditions in that city, including temperature, humidity, UV index, and a picture representing whether it is clear, cloudy, raining, etc. Additionally, a 5-day forecast for that city is displayed below the current conditions showing similar information (predicted at 12:00 PM on each day).er-selected criteria.

## App functioning

```
GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
WHEN I view the UV index
THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
WHEN I open the weather dashboard
THEN I am presented with the last searched city forecast
```

![Application Screenshot](assets/img/1.png)
![Application Screenshot](assets/img/2.png)

### Built With

-   HTML
-   SASS
-   JavaScript
-   jQuery
-   Leaflet.js
-   API https://api.openweathermap.org/data/2.5/

## Web Site Link

https://volodymyrbaisa.github.io/HW-WeatherApp/
