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
