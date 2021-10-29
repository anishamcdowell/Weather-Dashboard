var currentDate = moment().format('dddd, MMM Do, YYYY');

// API elements
const apiUrl = 'https://api.openweathermap.org/data/2.5';
const myKey = 'c532a4ca316c5a5b851492ddb2488a5c';

// Search elements
var searchHxDiv = $('#search-hx');

// Current location elements
var cityName = $('#current-city-name');
var iconContainer = $('#current-city-name-and-icon');
// TODO: var uvIndexEl = $('#current-uv-index');

// Current day's elements
var cityStats = $('.stat');
var cityName = $('#city-name');
var searchResultsContainer = $('#search-results');

// Five day forecast elements
var fiveDayIconContainer = $('#five-day-icon-container');
var fiveDayTextContainer = $('#five-day-text-container');
var fiveDayContainer = $('#five-day-container');

//Constructor for both one day and each five day forecast to use when displaying fetch response data to user
class Stats {
  constructor(temp, humidity, extraStat, image, iconContainer, textContainer) {
    this.temp = temp;
    this.humidity = humidity;
    this.extraStat = extraStat;
    this.image = image;
    this.iconContainer = iconContainer;
    this.textContainer = textContainer;
  }

  displayStats() {
    this.iconContainer.append(
      $('<img>').attr({
        src: this.image,
        class: 'weather-icon',
      })
    );
    // this.textContainer.html('');
    this.textContainer.append([
      $('<p>').html(`${this.temp}`),
      $('<p>').html(`${this.humidity}`),
      $('<p>').html(`${this.extraStat}`),
    ]);
  }

  dynamicDisplay() {
    $('#five-day-forecast').html();
  }
}

$(window).on('load', (e) => {
  $('#date').append(currentDate);

  getUserLocation();

  // Display search hx as buttons
  for (city in localStorage) {
    if (
      // Do not show these elements that are in local storage as part of the search history
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

    fetchWeather(localStorage.getItem('lastSearch'));
  }
});

// When user searches for a city...
$('#search-btn').click((e) => {
  e.preventDefault();
  // Save user input to local storage
  getAndSaveUserSearch(searchInput());
  // ifNullStorage(localStorage.getItem('lastSearch'));
  // API call
  getForecast(searchInput());
});

// ...capture user's input from the search box...
function searchInput() {
  let searchedCity = $('#search-box').val();
  return searchedCity.toLowerCase();
}

// ...save user input to localStorage and display in search history
function getAndSaveUserSearch(userInput) {
  let storageLength = localStorage.length;
  let displayLength = searchHxDiv.children().length;
  let whatsInStorage = JSON.parse(localStorage.getItem(userInput));

  if (userInput == '') {
    alert('No city specified');
  } else {
    if (storageLength < 10 && displayLength < 10) {
      if (
        userInput !== whatsInStorage &&
        !searchHxDiv.hasClass(`${userInput}`)
      ) {
        setData(userInput);
      } else if (storageLength > 10 && displayLength > 10) {
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
    console.log('data set');
    localStorage.setItem(userInput, JSON.stringify(userInput));
    searchHxDiv.prepend(`<button class="${userInput}">${userInput}</button>`);
  }

  // Remove data from local storage and from search history display
  function clearData() {
    // localStorage.clear();
    console.log('wtf');
  }
}

// ...Fetch forecast for chosen city
function getForecast(searchedCity) {
  if (
    localStorage.getItem('lastSearch') === 'null' ||
    localStorage.getItem('lastSearch') === '' ||
    localStorage.length === 0
  ) {
    searchResultsContainer.html(
      '<div class="null-history-message"><img src="./assets/search-img.png" /><p class="pseudo-header">Please search for a city</p></div>'
    );
    fetchWeather(searchedCity);
    getLastSearch(searchedCity);
    location.reload;
  } else {
    fetchWeather(searchedCity);
    getLastSearch(searchedCity);
  }

  getLastSearch(searchedCity);
}

// If there is no recent search history display a message telling user to search one; if there is a search history display the most recent
// function nullStorage(storageState) {
//   if (
//     storageState === 'null' ||
//     storageState === '' ||
//   ) {

//   }

//   // fetchWeather(storageState);
// }

function fetchWeather(searchedCity) {
  let searchUrl = `${apiUrl}/weather?q=${searchedCity}&units=imperial&appid=${myKey}`;
  let fiveDaySearchUrl = `${apiUrl}/forecast?q=${searchedCity}&units=imperial&appid=${myKey}`;

  Promise.all([fetch(searchUrl), fetch(fiveDaySearchUrl)])
    .then(async ([res1, res2]) => {
      const oneDayRes = await res1.json();
      const fiveDayRes = await res2.json();
      return [oneDayRes, fiveDayRes];
    })
    .then(([oneDayRes, fiveDayRes]) => {
      cityStats.html('');
      cityName.append(`<p>${searchedCity}</p>`);

      // Set and display today's weather (oneDayRes)
      const currentDay = new Stats(
        `Temperature: ${oneDayRes.main.temp} &deg;F`,
        `Humidity: ${oneDayRes.main.humidity}%`,
        `Wind Speed: ${oneDayRes.wind.speed} mph`,
        `https://openweathermap.org/img/wn/${oneDayRes.weather[0].icon}@2x.png`,
        $('#city-name-and-icon'),
        $('#current-day-stats')
      );

      searchResultsContainer.html(currentDay.displayStats());

      // Set and display weather for next five days (fiveDayRes)
      const { list } = fiveDayRes;

      const fiveDayArr = [0, 5, 12, 23, 31];

      fiveDayArr.map((i) => {
        const nextFiveDays = new Stats(
          `Temperature: ${list[i].main.temp} &deg;F`,
          `Humidity: ${list[i].main.humidity}%`,
          capitalizeString(list[i].weather[0].description),
          `https://openweathermap.org/img/wn/${list[i].weather[0].icon}@2x.png`,
          fiveDayIconContainer,
          fiveDayTextContainer
        );
        nextFiveDays.displayStats();
        fiveDayContainer.append(nextFiveDays);
      });
    });
}

//When user selects search history button
searchHxDiv.on('click', 'button', (e) => {
  e.preventDefault();
  getForecast($(e.target).text());
});

function getLastSearch(cityName) {
  localStorage.setItem('lastSearch', cityName);
}

function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(checkPermission);
  } else {
    console.log('error');
  }
}

const checkPermission = (position) => {
  const permissionDeniedResponse = $('.permission-denied');
  const permissionGrantedResponse = $('.permission-granted');

  navigator.permissions
    .query({ name: 'geolocation' })
    .then((permissionStatus) => {
      if (permissionStatus.state === 'granted') {
        permissionDeniedResponse.toggleClass('hide');
        showPosition(position);
      } else {
        permissionGrantedResponse.toggleClass('hide');
        console.log('hit');
      }
    });
};

const showPosition = (position) => {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  currentUrl = `${apiUrl}/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${myKey}`;

  fetch(currentUrl)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);
      const currentLocation = new Stats(
        `Temperature: ${data.main.temp} &deg;F`,
        `Humidity: ${data.main.humidity}%`,
        capitalizeString(data.weather[0].description),
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
        $('#current-location-icon-container'),
        $('#current-location-text-container')
      );

      currentLocation.displayStats();
      $('#location-name').html(`Current Location: ${data.name}`);
    });
};

function capitalizeString(string) {
  const capitalizedString =
    `${string.charAt(0).toUpperCase()}` + string.slice(1);
  return capitalizedString;
}
