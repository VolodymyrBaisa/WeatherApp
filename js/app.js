//======Variable======
const enter = 13; // Enter button
let isCelsius = false;
let currentRes = "";
let forecastRes = "";
//API
const mapApi = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const apiQuery = "https://api.openweathermap.org/data/2.5/";
const weather = "weather?";
const cnt = "&cnt=7";
const forecast = "forecast/daily?" + cnt;
const uvi = "uvi?";
const query = "&q=";
const lat = "&lat=";
const lon = "&lon=";
const appId = "&appid=166a433c57516f51dfab1f7edaed8413";

//Selectors
let searchButtonEl = $("#searchButton");
let searchEl = $("#search");
let scrollSearchedPlaceEl = $("#scrollSearchedPlace");
//Bottom panel
//Current
//Temperature
const currentTemperatureEl = $("#currentTemperature");
//Day
const currentDayEl = $("#currentDay");
//Humidity
const currentHumidityDistanceEl = $("#currentHumidityDistance");
const currentHumidityEl = $("#currentHumidity");
//Visibility
const currentVisibilityDistanceEl = $("#currentVisibilityDistance");
const currentVisibilityEl = $("#currentVisibility");
//Weather Icon
const currentWeatherIconEl = $("#currentWeatherIcon");
//Wind
const currentWindEl = $("#wind");
//Sunrise
const sunriseTime = $("#sunriseTime");
const sunriseTimeRemaining = $("#sunriseTimeRemaining");
//Sunset
const sunsetTime = $("#sunsetTime");
const sunsetTimeRemaining = $("#sunsetTimeRemaining");
//Next
const currentAndForecastEl = $("#currentAndForecast").children();
//Buttons
const celsiusButtonEl = $("#celsius");
const fahrenheitButtonEl = $("#fahrenheit");
//Map
const map = L.map("map");
//Widgets
const visibilityRangeThumbEl = $(".visibility-indicator #range-thumb");
const humidityRangeThumbEl = $(".humidity-indicator #range-thumb");
const uvDigitalEl = $(".uv-wrapper #uvDigital");
const uvMeterEl = $(".uv-wrapper #meter");

//======Events======
celsiusButtonEl.click(celsiusFahrenheitButton);
fahrenheitButtonEl.click(celsiusFahrenheitButton);
map.on("click", onMapClick);

//======Extension======
String.prototype.concat = function () {
    let concatenated = "";
    for (let arg of arguments) {
        concatenated += arg;
    }
    return this + concatenated;
};

Number.prototype.concat = function () {
    let concatenated = "";
    for (let arg of arguments) {
        concatenated += arg;
    }
    return this + concatenated;
};
//======Classes======
class SearchPanel {
    //Search
    searchElementRes(callback) {
        searchButtonEl.click(() => {
            callback(searchEl.val());
        });
        searchEl.on("keypress", (e) => {
            if (e.which === enter) {
                callback(searchEl.val());
            }
        });
    }

    addSearchedPlace(place, callback) {
        let searchRes = place;
        let showSearchEl = this.getSearchWrappedEl(
            this.getIdForSearchedWrapEl(),
            searchRes
        );
        scrollSearchedPlaceEl.append(showSearchEl);
        callback(showSearchEl);
    }

    getSearchWrappedEl(searchElId, searchRes) {
        switch (searchElId) {
            case 0:
                return $(
                    `<div data-index=0  class="search-result-wrapper-left"><div class="result">${searchRes}</div></div>`
                );
            case 1:
                return $(
                    `<div data-index=1  class="search-result-wrapper-center"><div class="result">${searchRes}</div></div>`
                );
            case 2:
                return $(
                    `<div data-index=2  class="search-result-wrapper-right"><div class="result">${searchRes}</div></div>`
                );
            default:
                return $(
                    `<div data-index=0  class="search-result-wrapper-left"><div class="result">${searchRes}</div></div>`
                );
        }
    }

    getAllSearchedWrapEl() {
        return scrollSearchedPlaceEl.children();
    }

    getIdForSearchedWrapEl() {
        let lastNodeDataId = this.getAllSearchedWrapEl().last().data("index");
        if (lastNodeDataId || lastNodeDataId === 0)
            switch (lastNodeDataId) {
                case 0:
                    return 1;
                case 1:
                    return 2;
                case 2:
                    return 0;
            }
    }

    placeNameFromSavedResults(element, callback) {
        element.click((e) => {
            callback($(e.target).find(".result").text());
        });
    }
}

class Levels {
    getHumidityLevel(lvl) {
        if (lvl >= 70) {
            return "Very High";
        } else if (lvl >= 60 && lvl <= 70) {
            return "High";
        } else if (lvl >= 30 && lvl < 60) {
            return "Normal";
        } else if (lvl >= 25 && lvl < 30) {
            return "Low";
        } else {
            return "Very Low";
        }
    }

    getVisibilityLevel(lvl) {
        if (lvl >= 10) {
            return "Very Good";
        } else if (lvl >= 6 && lvl <= 10) {
            return "Average";
        } else if (lvl >= 3 && lvl < 6) {
            return "Low";
        } else if (lvl < 3) {
            return "Very Low";
        }
    }
}

class GeoLocation {
    getGeolocation(callback) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                callback(pos);
            });
        } else {
            console.warn("Geolocation is not supported by this browser.");
        }
    }
}

class Converter {
    getKelvinToFahrenheit(value) {
        return Math.round(((value - 273.15) * 9) / 5 + 32);
    }

    getKelvinToCelsius(value) {
        return Math.round(value - 273.15);
    }
}

class Calender {
    constructor(dt) {
        if (dt) {
            this.date = new Date(dt);
        } else {
            this.date = new Date();
        }
    }

    getDayIndex() {
        return this.date.getDay();
    }

    getDate() {
        return this.date.getDate();
    }
    getShortDayNameByIndex(index) {
        switch (index) {
            case 1:
                return "Mon";
            case 2:
                return "Tue";
            case 3:
                return "Wed";
            case 4:
                return "Thu";
            case 5:
                return "Fri";
            case 6:
                return "Sat";
            case 7:
                return "Sun";
        }

        switch (index) {
            case 0:
                return "Sun";
            case 1:
                return "Mon";
            case 2:
                return "Tue";
            case 3:
                return "Wed";
            case 4:
                return "Thu";
            case 5:
                return "Fri";
            case 6:
                return "Sat";
        }
    }
    getFullDayNameByIndex(index) {
        switch (index) {
            case 0:
                return "Sunday";
            case 1:
                return "Monday";
            case 2:
                return "Tuesday";
            case 3:
                return "Wednesday";
            case 4:
                return "Thursday";
            case 5:
                return "Friday";
            case 6:
                return "Saturday";
        }
    }

    getOrdinalSuffixOf(i) {
        var j = i % 10,
            k = i % 100;
        if (j == 1 && k != 11) {
            return "st";
        }
        if (j == 2 && k != 12) {
            return "nd";
        }
        if (j == 3 && k != 13) {
            return "rd";
        }
        return "th";
    }

    getLocalTime() {
        return this.date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    getTimeToNextSunriseAndSunset() {
        let now = new Date();
        if (this.date < now) {
            this.date.setDate(this.date.getDate() + 1);
        }
        let msecDiff = this.date - now;
        let hh = Math.floor(msecDiff / 1000 / 60 / 60);
        msecDiff -= hh * 1000 * 60 * 60;
        let mm = Math.floor(msecDiff / 1000 / 60);
        msecDiff -= mm * 1000 * 60;
        let ss = Math.floor(msecDiff / 1000);
        return hh.concat("h ", mm, "m ", ss, "s");
    }
}

class API {
    getApiResponse(url, callbackResponse, callbackError) {
        if (url) {
            $.ajax({
                url: url,
                method: "GET",
            }).then(
                (res) => {
                    callbackResponse(res);
                },
                (err) => {
                    callbackError(err);
                }
            );
        }
    }
}

class Icons {
    getWeatherIcon(id) {
        let icon = "";
        switch (id) {
            case "01d":
                icon = "clear.svg";
                break;
            case "01n":
                icon = "nt_clear.svg";
                break;
            case "02d":
                icon = "mostlysunny.svg";
                break;
            case "02n":
                icon = "nt_mostlysunny.svg";
                break;
            case "03d":
                icon = "cloudy.svg";
                break;
            case "03n":
                icon = "nt_cloudy.svg";
                break;
            case "04d":
                icon = "mostlycloudy.svg";
                break;
            case "04n":
                icon = "nt_mostlycloudy.svg";
                break;
            case "09d":
                icon = "rain.svg";
                break;
            case "09n":
                icon = "nt_rain.svg";
                break;
            case "10d":
                icon = "chancerain.svg";
                break;
            case "10n":
                icon = "nt_chancerain.svg";
                break;
            case "11d":
                icon = "tstorms.svg";
                break;
            case "11n":
                icon = "nt_tstorms.svg";
                break;
            case "13d":
                icon = "snow.svg";
                break;
            case "13n":
                icon = "nt_snow.svg";
                break;
            case "50d":
                icon = "fog.svg";
                break;
            case "50n":
                icon = "nt_fog.svg";
                break;
            default:
                icon = "unknown.svg";
        }
        return `url("./icons/w/${icon}")`;
    }
}

class Widgets {
    setHumidity(lvl) {
        let val = 0;
        if (lvl >= 70) {
            val = 90;
        } else if (lvl >= 60 && lvl <= 70) {
            val = 70;
        } else if (lvl >= 30 && lvl < 60) {
            val = 50;
        } else if (lvl >= 25 && lvl < 30) {
            val = 30;
        } else {
            val = 0;
        }
        humidityRangeThumbEl.css("transform", `translateY(-${val}px)`);
    }

    setVisibility(lvl) {
        let val = 0;
        if (lvl >= 10) {
            val = 90;
        } else if (lvl >= 6 && lvl <= 10) {
            val = 60;
        } else if (lvl >= 3 && lvl < 6) {
            val = 30;
        } else if (lvl < 3) {
            val = 0;
        }
        visibilityRangeThumbEl.css("transform", `translateY(-${val}px)`);
    }

    setUV(lvl) {
        uvDigitalEl.text(lvl);
        uvMeterEl.css("stroke-dashoffset", 250 - (250 / 15) * lvl);
    }
}

class LocalStorage {
    put(place) {
        let getItems = localStorage.getItem("weather-app");
        if (getItems === null) {
            localStorage.setItem("weather-app", place);
        } else {
            if (!getItems.includes(place)) {
                localStorage.setItem("weather-app", `${getItems};${place}`);
            }
        }
    }

    pull() {
        let getItems = localStorage.getItem("weather-app");
        if (getItems) {
            let values = getItems.split(";");
            return values;
        }
    }
}

//======Functions======
//Init
const searchPanel = new SearchPanel();
const api = new API();
const converter = new Converter();
const levels = new Levels();
const icons = new Icons();
const widgets = new Widgets();
const storage = new LocalStorage();
(function () {
    //Restore searched places
    restoreSearchedPlacesFromLocalStorage();
    //Show the scale bar on the lower left corner
    L.control.scale().addTo(map);
    //Default weather from geolocation
    weatherResultFromGeolocation();
    //Get weather from search result
    weatherResultFromSearchPlace();
})();

function restoreSearchedPlacesFromLocalStorage() {
    let places = storage.pull();
    if (!places) return;
    for (let place of places) {
        console.log(place);
        searchPanel.addSearchedPlace(place, weatherResultFromSavedPlace);
    }
}

function weatherResultFromSearchPlace() {
    searchPanel.searchElementRes((place) => {
        //Current
        let current = apiQuery.concat(weather, query, place, appId);
        //Forecast
        let wForecast = apiQuery.concat(forecast, query, place, appId);

        let items = storage.pull();
        if (!items.includes(place)) {
            searchPanel.addSearchedPlace(place, weatherResultFromSavedPlace);
        }

        currentAndForecastWeather(current, wForecast);
        //Save search place to localStorage
        storage.put(place);
    });
}
//Get weather from saved place
function weatherResultFromSavedPlace(el) {
    searchPanel.placeNameFromSavedResults(el, (place) => {
        //Current
        let current = apiQuery.concat(weather, query, place, appId);
        //Forecast
        let wForecast = apiQuery.concat(forecast, query, place, appId);
        currentAndForecastWeather(current, wForecast);
    });
}
//Get weather from geolocation
function weatherResultFromGeolocation(wLat, wLon) {
    //Current
    let geoLocation = new GeoLocation();
    geoLocation.getGeolocation((pos) => {
        let current = apiQuery.concat(
            weather,
            query,
            lat,
            wLat ? wLat : pos.coords.latitude,
            lon,
            wLon ? wLon : pos.coords.longitude,
            appId
        );
        //Forecast
        let wForecast = apiQuery.concat(
            forecast,
            lat,
            pos.coords.latitude,
            lon,
            pos.coords.longitude,
            appId
        );
        currentAndForecastWeather(current, wForecast);
    });
}

function currentAndForecastWeather(current, forecast) {
    api.getApiResponse(
        current,
        (res) => {
            showCurrentWeatherInfoOnDisplay(res);
            //Show Weather Map
            showMap(res.name, res.coord.lon, res.coord.lat);
        },
        (err) => {
            console.error(err);
        }
    );

    api.getApiResponse(
        forecast,
        (res) => {
            showForecastWeatherInfoOnDisplay(res);
        },
        (err) => {
            console.error(err);
        }
    );
}
//Current
function showCurrentWeatherInfoOnDisplay(res) {
    if (res) {
        currentRes = res;
        //Temperature
        currentTemperatureEl.text(
            isCelsius
                ? converter.getKelvinToCelsius(res.main.temp).concat("°")
                : converter.getKelvinToFahrenheit(res.main.temp).concat("°")
        );
        //Day
        let calendar = new Calender();

        currentDayEl.text(
            calendar
                .getFullDayNameByIndex(calendar.getDayIndex())
                .concat(" ", calendar.getDate())
        );
        currentDayEl.attr(
            "data-after",
            calendar.getOrdinalSuffixOf(calendar.getDate())
        );
        //Weather icon
        currentWeatherIconEl.css(
            "background",
            icons.getWeatherIcon(res.weather[0].icon)
        );
        //Wind speed and angle
        currentWindEl.text(`${res.wind.speed}mph / ${res.wind.deg}°`);
        //Humidity
        currentHumidityDistanceEl.text(res.main.humidity);
        currentHumidityEl.text(levels.getHumidityLevel(res.main.humidity));
        widgets.setHumidity(res.main.humidity);
        //Visibility

        let visibility = Math.round(res.visibility / 1000);
        currentVisibilityDistanceEl.text(visibility);
        currentVisibilityEl.text(levels.getVisibilityLevel(visibility));
        widgets.setVisibility(visibility);
        //UV
        const uviQuery = apiQuery.concat(
            uvi,
            lat,
            res.coord.lat,
            lon,
            res.coord.lon,
            appId
        );
        api.getApiResponse(
            uviQuery,
            (res) => {
                widgets.setUV(res.value);
            },
            (err) => {
                console.error(err);
            }
        );
        //Sunrise
        calendar = new Calender(res.sys.sunrise * 1000);
        sunriseTime.text(calendar.getLocalTime());
        sunriseTimeRemaining.text(
            "-".concat(calendar.getTimeToNextSunriseAndSunset())
        );
        //Sunset
        calendar = new Calender(res.sys.sunset * 1000);
        sunsetTime.text(calendar.getLocalTime());
        sunsetTimeRemaining.text(
            "+".concat(calendar.getTimeToNextSunriseAndSunset())
        );
    }
}
//Forecast
function showForecastWeatherInfoOnDisplay(res) {
    if (res) {
        forecastRes = res;
        for (let i = 1; i < currentAndForecastEl.length; i++) {
            let wForecast = res.list[i];
            let element = currentAndForecastEl[i];
            let calendar = new Calender(wForecast.dt * 1000);
            $(element)
                .find(".day")
                .text(calendar.getShortDayNameByIndex(calendar.getDayIndex()));
            $(element)
                .find(".weather-icon")
                .css(
                    "background",
                    icons.getWeatherIcon(wForecast.weather[0].icon)
                );
            $(element)
                .find(".temperature")
                .text(
                    isCelsius
                        ? converter
                              .getKelvinToCelsius(wForecast.temp.day)
                              .concat("°")
                        : converter
                              .getKelvinToFahrenheit(wForecast.temp.day)
                              .concat("°")
                );
        }
    }
}

//Buttons
function celsiusFahrenheitButton(e) {
    e.stopPropagation();
    if (!isCelsius) {
        //Celsius
        isCelsius = true;
        celsiusButtonEl.addClass("active");
        fahrenheitButtonEl.removeClass("active");
    } else {
        //Fahrenheit
        isCelsius = false;
        celsiusButtonEl.removeClass("active");
        fahrenheitButtonEl.addClass("active");
    }
    //Update info
    //Temperature
    currentTemperatureEl.text(
        isCelsius
            ? converter.getKelvinToCelsius(currentRes.main.temp).concat("°")
            : converter.getKelvinToFahrenheit(currentRes.main.temp).concat("°")
    );
    //Forecast
    showForecastWeatherInfoOnDisplay(forecastRes);
}
//Map
function showMap(place, wLon, wLat) {
    //Clear all markers
    map.eachLayer((layer) => {
        layer.remove();
    });

    L.tileLayer(mapApi, {
        minZoom: 2,
        maxZoom: 19,
        attribution:
            '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>',
    }).addTo(map);
    map.setView([wLat, wLon], 10, { animation: true });

    // show a marker on the map
    if (place) {
        L.marker({ lon: wLon, lat: wLat }).bindPopup(place).addTo(map);
    } else {
        L.marker({ lon: wLon, lat: wLat }).addTo(map);
    }
}

function onMapClick(e) {
    let lat = e.latlng.lat;
    let lon = e.latlng.lng;
    weatherResultFromGeolocation(lat, lon);
}
