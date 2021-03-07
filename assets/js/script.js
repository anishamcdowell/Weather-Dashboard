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
var windSpeedEl = $("#wind-speed");
var uvIndexEl = $("#uv-index");
var currentLon;
var currentLat;

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
    var searchUrl = apiUrl + "?q=" + searchedCity +"&appid=" + myKey;

    //API is fetched with city name appended to URL
    fetch(searchUrl)
        .then (function(response) {
            return response.json();
        })
        .then (function(data){
            console.log(data);
            cityNameEl.append(`<p>${searchedCity}`);
            tempEl.append(`${data.main.temp}`);
            humidityEl.append(`${data.main.humidity}`);
            windSpeedEl.append(`${data.wind.speed}`);

            //Getting lon/lat for UV API
            currentLon = data.coord.lon;
            currentLat = data.coord.lat;
            console.log(currentLon);
            console.log(currentLat);
        })
        
});

// API Url for UV
// var apiUvUrl = "http://api.openweathermap.org/data/2.5/uvi?lat=" +{lat} +" &lon=" + {lon} + "&appid= + myKey"

// fetch(apiUvUrl)
//     .then (function(response) {
//         return response.json()
//     }).then (function(data) {
//         console.log(data)
//     });
            
//         // uvIndexEl
//             // fiveDayData();
//         // });

//     //Main city data appears in HTML document
//     function todaysData(data) {
        
//     };
//     //5 Day Forecast appears in HTML document
// });

