// API ELEMENTS
var apiUrl = "http://api.openweathermap.org/data/2.5/weather";
var myKey = "a590260e0a66edf311e2ebae9ded9db5";

//HTML ELEMENTS
var searchBoxEl = $("#search-box");
var searchButtonEl = $("#search-btn");
var searchHxEl = $("#search-hx");
var cityNameEl = $("#city-name");
var currentDate = moment().format("dddd, MMM Do, YYYY");
var tempEl = $("#temp");
var humidityEl = $("#humidity");
var windSpeedEl = $("#wind-speed");
var uvIndexEl = $("#uv-index");

//USER DEPENDENT VARIABLES
var searchedCity;
var currentLon;
var currentLat;
var key = localStorage.length;

//STORAGE DATA

for (var i = 0; i < localStorage.length; i++) { 
    searchHxEl.append(`<p>${localStorage.getItem(localStorage.key(i))}`)
};

//INITIAL LOAD BEHAVIOR
$("#date").append(currentDate);

//When the user types in a city and hits the search button
searchButtonEl.click(function(e) {
    e.preventDefault();
    
    cityNameEl.empty();
    tempEl.empty();
    humidityEl.empty();
    windSpeedEl.empty();
    uvIndexEl.empty();

    //Their input becomes stored in local storage and...
    searchedCity = searchBoxEl.val();
    localStorage.setItem(key++, searchedCity);
    //...added to the search hx display
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
            tempEl.append("Temperature: " + `${data.main.temp}`);
            humidityEl.append("Humidity: " + `${data.main.humidity}`);
            windSpeedEl.append("Wind Speed: " + `${data.wind.speed}`);

            //Getting lon/lat for UV API
            currentLon = data.coord.lon;
            currentLat = data.coord.lat;

            //Url for UV Index API
            var apiUvUrl = "http://api.openweathermap.org/data/2.5/uvi?lat=" + currentLat + "&lon=" + currentLon + "&appid=" + myKey;
    
             //Fetch UV Index API
            fetch(apiUvUrl)
              .then (function(response) {
                return response.json()
             }).then (function(data) {
                 console.log(data);
                 uvIndexEl.append("UV Index: " + `${data.value}`);
                 
                 //Color code UV index as favorable, moderate, or severe
                if (data.value > 10) {
                    uvIndexEl.append(" (Severe)");
                    $('#uv-index').css("color", "red");
                } else if (data.value < 6) {
                    uvIndexEl.append(" (Favorable)");
                    $('#uv-index').css("color", "blue");
                } else {
                    uvIndexEl.append(" (Moderate)");
                    $('#uv-index').css("color", "green");
                };
             }) 

             //Url for 5 Day Forecast API
             var fiveDayUrl = "http://api.openweathermap.org/data/2.5/forecast?q=" + searchedCity + "&appid=" + myKey;

             //Fetch 5 Day Forecast
             fetch(fiveDayUrl)
                .then (function (response) {
                    return response.json();
                })
                .then (function(data) {
                    console.log(data);
                });

                // cityNameEl.append(`<p>${searchedCity}`);
                // tempEl.append("Temperature: " + `${data.main.temp}`);
                // humidityEl.append("Humidity: " + `${data.main.humidity}`);
                // windSpeedEl.append("Wind Speed: " + `${data.wind.speed}`);
                
                // data.list.0.dt_text
                // data.list.main.temp
                // data.data.list.main.humidity
                
        });
});
