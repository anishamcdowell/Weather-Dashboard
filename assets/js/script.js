console.log("JS is working!");

// API ELEMENTS
var api = "http://api.openweathermap.org/data/2.5/"
var myKey = "a590260e0a66edf311e2ebae9ded9db5";

//HTML ELEMENTS
var searchBoxEl = $("#search-box");
var searchButtonEl = $("#search-btn");
var searchedCity;
var searchHxEl = $("#search-hx");
var key = 0;

//STORAGE DATA
for (var i = 0; i < localStorage.length; i++) { 
    searchHxEl.append(`<p>${localStorage.getItem(localStorage.key(i))}`)
};

//When the user types in a city and hits the search button
searchButtonEl.click(function(e) {
    e.preventDefault();
    searchedCity = searchBoxEl.val();
    console.log(searchedCity);
    localStorage.setItem(key++, searchedCity);
    searchHxEl.append(`<p>${searchedCity}`);

    // //Name of the city they are searching is appended to API url parameters
    // var cityUrl = ""
    // //My API key is appended to new url parameters
    // var fullUrl = ""
    // //API is fetched with all new parameters
    // fetch(fullUrl)
    //     .then (function(response) {
    //         return response.json();
    //     })
    //     .then (function(data){
    //         console.log(data);
    //     })

    // //Main city data appears in HTML document

    // //5 Day Forecast appears in HTML document
});

