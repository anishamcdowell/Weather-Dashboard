var currentDate = moment().format('dddd, MMM Do, YYYY');

// API elements
const apiUrl = 'https://api.openweathermap.org/data/2.5';
const myKey = 'c532a4ca316c5a5b851492ddb2488a5c';

// Search elements
var searchBox = $('#search-box');
var searchButton = $('#search-btn');
var searchHxDiv = $('#search-hx');

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
var fiveDayStatsContainer = $('#five-day-stats');

//User location elements
let currentLon;
let currentLat;

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
  getForecast(localStorage.getItem('lastSearch'));
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
      return [oneDayRes, fiveDayRes];
    })
    .then(([oneDayRes, fiveDayRes]) => {
      // Clear the current search results and set to new city
      cityStats.html('');
      cityNameEl.append(`<p>${searchedCity}`);

      //Constructor for both one day and each five day forecast to use when displaying fetch response data to user
      class Stats {
        constructor(
          temp,
          humidity,
          extraStat,
          image,
          iconContainer,
          textContainer
        ) {
          this.temp = temp;
          this.humidity = humidity;
          this.extraStat = extraStat;
          this.image = image;
          this.iconContainer = iconContainer;
          this.textContainer = textContainer;
        }

        displayStats() {
          this.iconContainer.append($('<img>').attr('src', this.image));
          this.textContainer.append([
            $('<p>').html(`${this.temp}`),
            $('<p>').html(`${this.humidity}`),
            $('<p>').html(`${this.extraStat}`),
          ]);
        }
      }

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

      // Extend stats class to better fit data format difference between one day/five day responses
      // class fiveDayForecastStats extends Stats {

      // }

      // Set and display weather for next five days (fiveDayRes)
      const { list } = fiveDayRes;
      console.log(typeof list, list[0].dt_txt);
      // TODO: 0 needs to become i wherei can select specific index from list
      const fiveDayArr = [0, 5, 12, 23, 31];

      fiveDayArr.map((i) => {
        const nextFiveDays = new Stats(
          `Temperature: ${list[0].main.temp} &deg;F`,
          `Humidity: ${list[0].main.humidity}%`,
          `${list[0].weather[0].description}`,
          `https://openweathermap.org/img/wn/${list[0].weather[0].icon}@2x.png`,
          fiveDayIconContainer,
          fiveDayStatsContainer
        );

        nextFiveDays.displayStats();
      });

      // const fiveDayIcon = fiveDayRes.list[0].weather[0].icon;
      // const fiveDayImg = $('<img>').attr(
      //   'src',
      //   `https://openweathermap.org/img/wn/${fiveDayIcon}@2x.png`
      // );
      // fiveDayStats.append(fiveDayImg);

      //map through fiveDayResults and for results at index i return a Stat constructor
      // console.log(typeof fiveDayRes);
      // for (const [key, value] of Object.entries(fiveDayRes.list[0])) {
      //   console.log(`${key}: ${value}`);
      // }
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
