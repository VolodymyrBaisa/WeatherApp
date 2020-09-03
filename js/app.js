//======Variable======
//API
const apiQuery = "https://api.openweathermap.org/data/2.5/weather?";
const query = "&q=";
const lat = "&lat=";
const lon = "&lon=";
const appId = "&appid=1a01732382f274dc565f83ea262b06d6";

const enter = 13; // Enter button

//Selectors
let searchButtonEl = $("#searchButton");
let searchEl = $("#search");
let scrollSearchedPlaceEl = $("#scrollSearchedPlace");

//Extension
String.prototype.concat = function () {
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

    addSearchedPlace(res, callback) {
        let searchRes = res.name.concat(", ", res.sys.country);
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
//======Functions======
//Init
let searchPanel = new SearchPanel();
let api = new API();
(function () {
    //Default weather from geolocation
    weatherResultFromGeolocation();
    //Get weather from search result
    searchPanel.searchElementRes((place) => {
        let url = apiQuery.concat(query, place, appId);
        api.getApiResponse(
            url,
            (res) => {
                searchPanel.addSearchedPlace(res, weatherResultFromSavedPlace);
                showWeatherInfoOnDisplay(res);
            },
            (err) => {
                console.error(err);
            }
        );
    });
})();
//Get result from saved place
function weatherResultFromSavedPlace(el) {
    searchPanel.placeNameFromSavedResults(el, (place) => {
        let url = apiQuery.concat(query, place, appId);
        api.getApiResponse(
            url,
            (res) => {
                showWeatherInfoOnDisplay(res);
            },
            (err) => {
                console.error(err);
            }
        );
    });
}
//Get result from geolocation
function weatherResultFromGeolocation() {
    let geoLocation = new GeoLocation();
    geoLocation.getGeolocation((pos) => {
        let url = apiQuery.concat(
            query,
            lat,
            pos.coords.latitude,
            lon,
            pos.coords.longitude,
            appId
        );
        api.getApiResponse(
            url,
            (res) => {
                showWeatherInfoOnDisplay(res);
            },
            (err) => {
                console.error(err);
            }
        );
    });
}

function showWeatherInfoOnDisplay(res) {
    console.log(res);
}
