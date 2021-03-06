// API ELEMENTS
var apiUrl = "http://api.openweathermap.org/data/2.5/weather";
var myKey = "a590260e0a66edf311e2ebae9ded9db5";

//HTML ELEMENTS
var searchBoxEl = $("#search-box");
var searchButtonEl = $("#search-btn");
var searchedCity;
var searchHxEl = $("#search-hx");
var cityNameEl = $("#city-name");
var currentDate = moment().format("dddd, MMM Do, YYYY");
var tempEl = $("#temp");
var humidityEl = $("#humidity");
var windSpeedEl = $("#winde-speed");
var uvIndexEl = $("#uv-index");

//STORAGE DATA
var key = localStorage.length;
for (var i = 0; i < localStorage.length; i++) { 
    searchHxEl.append(`<p>${localStorage.getItem(localStorage.key(i))}`)
};

//INITIAL LOAD BEHAVIOR
$("#date").append(currentDate);

//When the user types in a city and hits the search button
searchButtonEl.click(function(e) {
    e.preventDefault();
    searchedCity = searchBoxEl.val();
    console.log(searchedCity);
    localStorage.setItem(key++, searchedCity);
    searchHxEl.append(`<p>${searchedCity}`);

    //Name of the city user searched is appended to API url parameters with my API key
    searchUrl = apiUrl + "?q=" + searchedCity +"&appid=" + myKey;
    //API is fetched with city name appended to URL
    fetch(searchUrl)
        .then (function(response) {
            return response.json();
        })
        .then (function(data){
            console.log(data);
            todaysData();
            // fiveDayData();
        })

    //Main city data appears in HTML document
    function todaysData() {
        cityNameEl.append(`<p>${searchedCity}`);
        tempEl
        humidityEl.
        windSpeedEl
        uvIndexEl
    };
    //5 Day Forecast appears in HTML document
});

