var currentDate = moment().format('dddd, MMM Do, YYYY');

// API elements
const apiUrl = 'https://api.openweathermap.org/data/2.5';
const myKey = 'c532a4ca316c5a5b851492ddb2488a5c';

// Search elements
https: var searchBox = $('#search-box');
var searchButton = $('#search-btn');
var searchHxDiv = $('#search-hx');

// Current location elements
let usersPosition;
var currentLocationName = $('#location-name');
let currentLocationIconContainer = $('#current-location-icon-container');
let currentLocationTextContainer = $('#current-location-text-container');
var currentLocationWrapper = $('#current-location-section');
var cityNameEl = $('#current-city-name');
var iconContainer = $('#current-city-name-and-icon');
var tempEl = $('#current-temp');
var humidityEl = $('#current-humidity');
var windSpeedEl = $('#current-wind-speed');
var uvIndexEl = $('#current-uv-index');

// Current day's elements
var cityStats = $('.stat');
var cityNameEl = $('#city-name');
var currentDayIconContainer = $('#city-name-and-icon');
var currentDayStatsContainer = $('#current-day-stats');
var tempEl = $('#temp');
var humidityEl = $('#humidity');
var windSpeedEl = $('#wind-speed');
var uvIndexEl = $('#uv-index');

// Five day forecast elements
var fiveDayStats = $('#five-day-forecast');
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
    $(fiveDayStats).html();
  }
}

$(window).on('load', (e) => {
  // Display current date/time and search history
  $('#date').append(currentDate);
  // Display search hx as buttons
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
  getUserLocation();
  getForecast(localStorage.getItem('lastSearch'));
  // On load and before and local storage gets anything: indicate location permissions have not been given
});

// When user searches for a city...
searchButton.click((e) => {
  e.preventDefault();
  getAndSaveUserSearch(searchInput());
  getForecast(searchInput());
});

// ...capture user's input from the search box...
function searchInput() {
  let searchedCity = searchBox.val();
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
  let fiveDaySearchUrl = `${apiUrl}/forecast?q=${searchedCity}&units=imperial&appid=${myKey}`;

  Promise.all([fetch(searchUrl), fetch(fiveDaySearchUrl)])
    .then(async ([res1, res2]) => {
      const oneDayRes = await res1.json();
      const fiveDayRes = await res2.json();
      return [oneDayRes, fiveDayRes];
    })
    .then(([oneDayRes, fiveDayRes]) => {
      // Clear the current search results and set to new city
      cityStats.html('');
      cityNameEl.append(`<p>${searchedCity}`);

      // Set and display today's weather (oneDayRes)
      const currentDay = new Stats(
        `Temperature: ${oneDayRes.main.temp} &deg;F`,
        `Humidity: ${oneDayRes.main.humidity}%`,
        `Wind Speed: ${oneDayRes.wind.speed} mph`,
        `https://openweathermap.org/img/wn/${oneDayRes.weather[0].icon}@2x.png`,
        currentDayIconContainer,
        currentDayStatsContainer
      );

      currentDay.displayStats();

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

function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(checkPermission);
  } else console.log('error');
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
        currentLocationIconContainer,
        currentLocationTextContainer
      );

      currentLocation.displayStats();
      currentLocationName.html(`Current Location: ${data.name}`);
    });
};

function capitalizeString(string) {
  const capitalizedString =
    `${string.charAt(0).toUpperCase()}` + string.slice(1);
  return capitalizedString;
}
