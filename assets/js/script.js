// API ELEMENTS
var apiUrl = "https://api.openweathermap.org/data/2.5/weather";
var myKey = "a590260e0a66edf311e2ebae9ded9db5";

//HTML ELEMENTS
var searchBoxEl = $("#search-box");
var searchButtonEl = $("#search-btn");
var searchHxUl = $("#hx-list");
var cityNameEl = $("#city-name");
var currentDate = moment().format("dddd, MMM Do, YYYY");
var tempEl = $("#temp");
var humidityEl = $("#humidity");
var windSpeedEl = $("#wind-speed");
var uvIndexEl = $("#uv-index");
var iconContainer = $("#city-name-and-icon");
var singleDayStats = $("#city-display");
var fiveDayStats = $("#five-day-forecast");

//USER DEPENDENT VARIABLES
var searchedCity;
var currentLon;
var currentLat;
var key = localStorage.length;

//STORAGE DATA
var lastSearch = localStorage.key(i);
for (var i = 0; i < localStorage.length; i++) {
  searchHxUl.append(`<p>${localStorage.getItem(localStorage.key(i))}`);
}

$();
//INITIAL LOAD BEHAVIOR
$("#date").append(currentDate);
singleDayStats.addClass("hidden");
fiveDayStats.addClass("hidden");

var localMemory = window.localStorage.getItem("searchedCity");

//When the user types in a city and hits the search button
searchButtonEl.click(function getWeather(e) {
  //Prevent form submit refresh
  e.preventDefault();

  //Clear last search's stats
  function clearDisplay() {
    cityNameEl.empty();
    tempEl.empty();
    humidityEl.empty();
    windSpeedEl.empty();
    uvIndexEl.empty();
    iconContainer.empty();
  }
  clearDisplay();
  
  singleDayStats.removeClass("hidden");
  fiveDayStats.removeClass("hidden");

  //User input becomes stored in local storage and...
  searchedCity = searchBoxEl.val();
  localStorage.setItem(key++, searchedCity);
  //...added to the search hx display
  var hxButton = $(`<button>${searchedCity}</button>`);
  hxButton.attr({
    type: "submit",
    id: "hx-btn",
    display: "block",
  });
  searchHxUl.append(hxButton);

  //Daily forecast fetched
  dailyForecast();

  //5 day forecast fetched
  // fiveDayForecast();
});

function dailyForecast() {
  //Name of the city user searched is appended to API url with my API key
  var searchUrl = `${apiUrl}?q=${searchedCity}&units=imperial&appid=${myKey}`;

  //Correct url with user input is fetched
  fetch(searchUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var iconCode = data.weather[0].icon;
      var img = $("<img>");
      img.attr(
        "src",
        "https://openweathermap.org/img/wn/" + iconCode + "@2x.png"
      );
      iconContainer.append(img);
      cityNameEl.append(`<p>${searchedCity}`);
      tempEl.append("Temperature: " + data.main.temp + "&deg;F");
      humidityEl.append("Humidity: " + data.main.humidity + "%");
      windSpeedEl.append("Wind Speed: " + data.wind.speed + "mph");

      //Getting current search's lon/lat for UV API
      currentLon = data.coord.lon;
      currentLat = data.coord.lat;

      //Url for UV Index API
      var apiUvUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${currentLat}&lon=${currentLon}&appid=${myKey} `;

      //Fetch UV Index API
      fetch(apiUvUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          console.log(data);
          uvIndexEl.append("UV Index: " + data.value);

          //Color code UV index as favorable, moderate, or severe
          if (data.value > 10) {
            uvIndexEl.append(" (Severe)");
            $("#uv-index").css("color", "red");
          } else if (data.value < 6) {
            uvIndexEl.append(" (Favorable)");
            $("#uv-index").css("color", "blue");
          } else {
            uvIndexEl.append(" (Moderate)");
            $("#uv-index").css("color", "green");
          }
        });

      //Url for 5 Day Forecast API
      var fiveDayUrl =
        "https://api.openweathermap.org/data/2.5/forecast?q=" +
        searchedCity +
        "&units=imperial&appid=" +
        myKey;

      //Fetch 5 Day Forecast
      fetch(fiveDayUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          console.log(data, "working");
          //Console log the next 5 days of the forecast
          for (var i = 3; i < data.list.length; i += 8) {
            nextDay = moment(data.list[i].dt_txt).format("dddd, MMM Do, YYYY");
            nextTemp = data.list[i].main.temp;
            nextHumidity = data.list[i].main.humidity;
            nextIcon = data.list[i].weather[0].icon;


            $("#card-container").append(`
            <div class="card">
                    <p>${nextDay}</p>
                    <ul class="ul">
                        <li>
                        <img src="https://openweathermap.org/img/wn/${nextIcon}@2x.png">
                        </li>
                        <li>Temp: ${nextTemp}</li>
                        <li>Humidity: ${nextHumidity}</li>
                    </ul>
                </div>
            `);
          }

          

          //Assign temps, humidity, and icons to correct day in 5 day forecast
          for (var i = 0; i < $(".forecast-temp"); i++) {}
        });
    });

  // cityNameEl.append(`<p>${searchedCity}`);
  // tempEl.append("Temperature: " + `${data.main.temp}`);
  // humidityEl.append("Humidity: " + `${data.main.humidity}`);
  // windSpeedEl.append("Wind Speed: " + `${data.wind.speed}`);

  // data.list.0.dt_text
  // data.list.main.temp
  // data.data.list.main.humidity
}
