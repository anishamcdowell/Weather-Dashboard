var currentLocationWrapper = $('#current-location');
var cityNameEl = $('#current-city-name');
var iconContainer = $('#current-city-name-and-icon');
var tempEl = $('#current-temp');
var humidityEl = $('#current-humidity');
var windSpeedEl = $('#current-wind-speed');
var uvIndexEl = $('#current-uv-index');

// On load and before and local storage gets anything: indicate location permissions have not been given
currentLocationWrapper.html(
  '<div class="no-current-location"><p> Unable to find current location</p><button>Try Again</button><img src="../assets/search-img.png" class="search-placeholder-icon"/></div > '
);
