$(document).ready(function () {
  //add search button functionality
  $("#search-button").on("click", function () {
    var cityName = $("#search-value").val();
    // Denver
    //append searched cities below search box

    // clear search box
    $("#search-value").val("");

    searchWeather(cityName);
  });

  function searchWeather(cityName) {
    // var cityName = "Denver";
    // Go into API and gather weather info based on cityName
    var apikey = "74fef4641e0974b5f048a0fe6206abb8";
    //Display current city
    //Display current date
    //Display current weather condition icon
    //Display current temperature
    //Display current humidity
    //Display current wind speed
    //Display UV Index with color-coded value
    //Display 5-day forecast
    //Forecast date, weather icon, temp, high temp, humidity
  }
});

//https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={your api key}
//https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={your api key}
//https://api.openweathermap.org/data/2.5/forecast?q={city name}&appid={your api key}

// Scope in a function

function scopeExample() {
  $.ajax({
    url: URLforCurrentWeatherData,
    method: "GET",
  }).then(function (response) {
    console.log(response);

    // make another ajax call for one call api aka for the uvi and feed in the lat and lon from the current weather data api response
  });

  console.log(response); //won't work out here
  $.ajax({
    url: URLFor5Day,
  });
}
