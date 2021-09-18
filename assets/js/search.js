// API ELEMENTS
var apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
var myKey = 'a590260e0a66edf711e2ebae9ded9db5';

//HTML ELEMENTS
var currentDate = moment().format('dddd, MMM Do, YYYY');
// Search elements
var searchBox = $('#search-box');
var searchButton = $('#search-btn');
var searchHx = $('#search-hx');
// Search result elements
var cityNameEl = $('#city-name');
var iconContainer = $('#city-name-and-icon');
var tempEl = $('#temp');
var humidityEl = $('#humidity');
var windSpeedEl = $('#wind-speed');
var uvIndexEl = $('#uv-index');
var singleDayStats = $('#city-display');
var fiveDayStats = $('#five-day-forecast');

//USER DEPENDENT VARIABLES
var currentLon;
var currentLat;

//INITIAL LOAD BEHAVIOR
$('#date').append(currentDate);

// On load display most recently searched cities in search history div
$(window).on('load', (e) => {
  for (city in localStorage) {
    if (
      city !== 'length' &&
      city !== 'clear' &&
      city !== 'getItem' &&
      city !== 'key' &&
      city !== 'removeItem' &&
      city !== 'setItem'
    ) {
      searchHx.append(`<button class=${city}>${city}</button>`);
    }
  }
});

// When user searches for a city
searchButton.click((e) => {
  e.preventDefault();
  // Get user's search box input and save to localStorage and display in search history div
  getAndSaveUserSearch(searchInput());
  getForecast(searchInput());
});

// Capture user's input from the search box
function searchInput() {
  let searchedCity = searchBox.val();
  return searchedCity.toLowerCase();
}

// Fetch forecast
function getForecast(searchedCity) {
  console.log('getforecast function =', searchedCity);
}

// Take captured data and save to localStorage and display in search history dvi
function getAndSaveUserSearch(userInput) {
  let storageLength = localStorage.length;
  let displayLength = searchHx.children().length;
  let whatsInStorage = JSON.parse(localStorage.getItem(userInput));

  if (userInput == '') {
    alert('No city specified');
  } else {
    if (storageLength < 7 && displayLength < 7) {
      if (userInput !== whatsInStorage && !searchHx.hasClass(`${userInput}`)) {
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
    searchHx.prepend(`<button class="${userInput}">${userInput}</button>`);
  }

  // Remove data from local storage and from display in search history div
  function clearData() {
    localStorage.clear();
    searchHx.empty();
  }
}
