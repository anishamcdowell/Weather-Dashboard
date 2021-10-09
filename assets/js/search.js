var currentDate = moment().format('dddd, MMM Do, YYYY');

// API elements
const apiUrl = 'https://api.openweathermap.org/data/2.5';
const myKey = 'c532a4ca316c5a5b851492ddb2488a5c';

// Search elements
var searchBox = $('#search-box');
var searchButton = $('#search-btn');
var searchHxDiv = $('#search-hx');

// Search result elements
var cityStats = $('.stat');
var cityNameEl = $('#city-name');
var iconContainer = $('#city-name-and-icon');
var tempEl = $('#temp');
var humidityEl = $('#humidity');
var windSpeedEl = $('#wind-speed');
var uvIndexEl = $('#uv-index');
var singleDayStats = $('#city-display');
var fiveDayStats = $('#five-day-forecast');

//User location elements
let currentLon;
let currentLat;

// On load..
$(window).on('load', (e) => {
  //..display current date/time and search history..
  $('#date').append(currentDate);
  //..display search hx as buttons..
  for (city in localStorage) {
    if (
      city !== 'length' &&
      city !== 'clear' &&
      city !== 'getItem' &&
      city !== 'key' &&
      city !== 'removeItem' &&
      city !== 'setItem' &&
      city !== 'lastSearch'
    ) {
      searchHxDiv.append(
        `<button class="searched-city" id=${city}>${city}</button>`
      );
    }
  }
  getForecast(localStorage.getItem('lastSearch'));
});

// When user searches for a city...
searchButton.click((e) => {
  e.preventDefault();
  getAndSaveUserSearch(searchInput());
  getForecast(searchInput());
});

// ...Capture user's input from the search box
function searchInput() {
  let searchedCity = searchBox.val();
  return searchedCity.toLowerCase();
}

// ...Save user input to localStorage and display in search history
function getAndSaveUserSearch(userInput) {
  let storageLength = localStorage.length;
  let displayLength = searchHxDiv.children().length;
  let whatsInStorage = JSON.parse(localStorage.getItem(userInput));

  if (userInput == '') {
    alert('No city specified');
  } else {
    if (storageLength < 7 && displayLength < 7) {
      if (
        userInput !== whatsInStorage &&
        !searchHxDiv.hasClass(`${userInput}`)
      ) {
        setData(userInput);
      } else if (storageLength > 7 && displayLength > 7) {
        clearData();
      } else {
        return;
      }
    } else {
      clearData();
      setData(userInput);
    }
  }

  // Set data in local storage and as an HTML element
  function setData(userInput) {
    localStorage.setItem(userInput, JSON.stringify(userInput));
    searchHxDiv.prepend(`<button class="${userInput}">${userInput}</button>`);
  }

  // Remove data from local storage and from search history display
  function clearData() {
    localStorage.clear();
    searchHxDiv.empty();
  }
}

// ...Fetch forecast for chosen city
function getForecast(searchedCity) {
  let searchUrl = `${apiUrl}/weather?q=${searchedCity}&units=imperial&appid=${myKey}`;
  let fiveDaySearchUrl = `${apiUrl}/forecast?q=${searchedCity}&appid=${myKey}`;

  Promise.all([fetch(searchUrl), fetch(fiveDaySearchUrl)])
    .then(async ([res1, res2]) => {
      const oneDayRes = await res1.json();
      const fiveDayRes = await res2.json();
      console.log(oneDayRes, fiveDayRes);
      return [oneDayRes, fiveDayRes];
    })
    .then(([oneDayRes, fiveDayRes]) => {
      // One Day Weather
      cityStats.html('');
      const icon = oneDayRes.weather[0].icon;
      const img = $('<img>');
      img.attr('src', `https://openweathermap.org/img/wn/${icon}@2x.png`);
      iconContainer.append(img);
      cityNameEl.append(`<p>${searchedCity}`);
      tempEl.append(`Temperature: ${oneDayRes.main.temp} &deg;F`);
      humidityEl.append(`Humidity: ${oneDayRes.main.humidity}%`);
      windSpeedEl.append(`Wind Speed: ${oneDayRes.wind.speed} mph`);
      // Five Day Forecast
      // fiveDayRes.
    });
  getLastSearch(searchedCity);
}

//When user selects search history button
searchHxDiv.on('click', 'button', (e) => {
  e.preventDefault();
  getForecast($(e.target).text());
});

function getLastSearch(cityName) {
  localStorage.setItem('lastSearch', cityName);
}
