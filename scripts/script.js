$(document).ready(function () {
  //add search button functionality
  $("#search-button").on("click", function () {
    var searchValue = $("#search-value").val();

    // clear search box
    $("#search-value").val("");

    searchWeather(searchValue);
  });

  //append searched cities below search box
  //Display current city
  //Display current date
  //Display current weather condition icon
  //Display current temperature
  //Display current humidity
  //Display current wind speed
  //Display UV Index with color-coded value
  //Display 5-day forecast
  //Forecast date, weather icon, temp, high temp, humidity
});
