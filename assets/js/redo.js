// 1. User opens weather app and today's day is visible along with most recent search hx is visible in
// Search box and
// in main div and
// in 5 day forecast

// 2. User searches a city by name and clicks search button which triggers:

    // 3. User's searched city is stored to local storage and displays in search hx bar and

    // 4. User's searched city is fetched from the
        // a. general weather data api
        // b. uvi index api
        // c. 5 day forecast api
    //and converted to a json object

    // 5. The general weather data and uvi index data fills out in the main div for
        //temp
        //humidity
        //wind speed
        //uv index

    //6. The 5 day forecast fills out a unique card for each coming day's temp and humidity



    //Assign temps, humidity, and icons to correct day in 5 day forecast
        // cityNameEl.append(`<p>${searchedCity}`);
        // tempEl.append("Temperature: " + `${data.main.temp}`);
        // humidityEl.append("Humidity: " + `${data.main.humidity}`);
        // windSpeedEl.append("Wind Speed: " + `${data.wind.speed}`);
                
        // data.list.0.dt_text
        // data.list.main.temp
        // data.data.list.main.humidity


        
// function fiveDayForecast() {
//     //Url for 5 Day Forecast API
//     var fiveDayUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${searchedCity}&units=imperial&appid=${myKey}`;

//     //Fetch 5 Day Forecast
//     fetch(fiveDayUrl)
//         .then (function (response) {
//             return response.json();
//         })
//         .then (function(data) {
//             console.log(data);
//             //Console log the next 5 days of the forecast
//             for (var i = 3; i < data.list.length; i+=8) {
//                 nextDay = moment(data.list[i].dt_txt).format("dddd, MMM Do, YYYY")
//                 nextTemp = (data.list[i].main.temp);
//                 nextHumidity = (data.list[i].main.humidity)
//             }
//         });