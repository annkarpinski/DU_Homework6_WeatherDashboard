$(document).ready(function () {
  //variable to hold user city searches
  var searchHistory = [];

  // Everytime page refresh, grab cities from local storage
  // Parsing the JSON string to an object
  var storedCities = JSON.parse(localStorage.getItem("cityName"));

  // If cities were retrieved from localStorage, update the cities array to it
  if (storedCities !== null) {
    searchHistory = storedCities;
  }

  console.log(searchHistory);
  // Render the array of cities to the history <ul>

  //add search button functionality
  $("#search-button").on("click", function () {
    var cityName = $("#search-value").val();

    //Press Enter key to begin search
    // $(document).on("keypress", "input", function (e) {
    //   if (e.which == 13) {
    //     $("#search-value").val();
    //   }
    // });

    //push cityName to searchHistory array upon user click on Search button
    //save to localstorage.setItem
    //then display searchHistory array as new list in #history
    function addToHistory(array) {
      var newCity = $("<li>").text(cityName);
      $("#history").prepend(array);
      console.log(newCity);
    }

    // if (searchHistory.index0f(cityName) === -1) {
    searchHistory.push(cityName);
    console.log(searchHistory);
    localStorage.setItem("cityName", JSON.stringify(searchHistory));
    addToHistory(searchHistory);
    // }

    currentWeather(cityName);
    fiveDayForecast(cityName);

    // clear search box
    $("#search-value").val("");
  });

  var apiKey = "74fef4641e0974b5f048a0fe6206abb8";

  //function to get current weather conditions
  function currentWeather(cityName) {
    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      cityName +
      "&appid=" +
      apiKey +
      "&units=imperial";
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      // make another ajax call for one call api aka for the uvi and feed in the lat and lon from the current weather data api response
      //variables for data to display on current weather card
      var city = response.name;
      var currentDate = moment().format("M/DD/YYYY");
      var temp = response.main.temp;
      var humidity = response.main.humidity;
      var wind = response.wind.speed;

      //Create HTML elements for current weather
      var current = $("#current");
      var currentCard = $("<div>").addClass("card").attr("class", "m-3");
      var currentCardTitle = $("<h3>")
        .addClass("card-title")
        .text(city + " " + "(" + currentDate + ")");
      var currentWeatherIcon = $("<img>").attr(
        "src",
        "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png"
      );
      var currentCardData = $("<div>").addClass("card-text");
      var currentTemp = $("<p>").text("Temperature: " + temp + " °F");
      var currentHumidity = $("<p>").text("Humidity: " + humidity + "%");
      var currentWind = $("<p>").text("Wind Speed: " + wind + " MPH");

      //clear current weather when another city is searched
      current.empty();

      //nested API call and AJAX method for lat and lon to connect to cities objects in weather and forecast APIs to get UV data
      var queryLatLon =
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        response.coord.lat +
        "&lon=" +
        response.coord.lon +
        "&appid=" +
        apiKey +
        "&units=imperial";

      $.ajax({
        url: queryLatLon,
        method: "GET",
      }).then(function (data) {
        //Add UV index to current weather
        var uvNumber = data.current.uvi;
        var currentUVI = $("<p>").text("UV Index: ");
        currentCardData.append(currentUVI);
        var uvColor = $("<span>").addClass("btn btn-sm").text(uvNumber);
        //Add UV color coding
        if (uvNumber < 3) {
          uvColor.addClass("btn-success");
        } else if (uvNumber < 7) {
          uvColor.addClass("btn-warning");
        } else {
          uvColor.addClass("btn-danger");
        }
        $("#today .card-body").append(currentUVI.append(uvColor));
      });

      //Append current weather card and contents to the page
      current.append(currentCard);
      currentCard.append(currentCardTitle);
      currentCardTitle.append(currentWeatherIcon);
      currentCard.append(currentCardData);
      currentCardData.append(currentTemp, currentHumidity, currentWind);
    });
  }

  //function to get 5-day forecast
  function fiveDayForecast(cityName) {
    var queryURL =
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
      cityName +
      "&appid=" +
      apiKey +
      "&units=imperial";
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      //clear forecast info when user searches for new city
      $("#forecastHeader").empty();
      var forecast = $("#forecast");
      forecast.empty();
      var forecastH3 = $("<h3>").text("5-Day Forecast").attr("class", "m-3");
      $("#forecastHeader").append(forecastH3);

      //Loop to create 5 cards for 5-day forecast
      for (i = 6; i < response.list.length; i += 8) {
        // if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
        //variables for data to display on 5-day forecast weather cards
        // i = 0, i = 1, i = 2, i = 3, i = 4
        // i = 6, i = 14, i = 22, i = 30, i = 38
        var forecastDate = moment(response.list[i].dt_txt).format("MM/DD/YYYY");
        var forecastWeatherIcon = response.list[i].weather.icon;
        var forecastTemp = response.list[i].main.temp;
        var forecastHumidity = response.list[i].main.humidity;

        //Create HTML elements for forecast weather
        var forecastCol = $("<div>").attr("class", "col-md-2");
        var forecastCard = $("<div>").addClass("card bg-primary");
        var forecastCardTitle = $("<h5>")
          .addClass("card-title text-white ml-3 mt-2")
          .text(forecastDate);
        var forecastCardData = $("<div>")
          .addClass("card-text text-white ml-3")
          .attr("id", "forecastData");
        var forecastWeatherIcon = $("<img>").attr(
          "src",
          "http://openweathermap.org/img/w/" +
            response.list[i].weather[0].icon +
            ".png"
        );
        var forecastTemp = $("<p>").text("Temp: " + forecastTemp + " °F");
        var forecastHumidity = $("<p>").text(
          "Humidity: " + forecastHumidity + "%"
        );

        //Append forecast weather cards and contents to the page
        forecast.append(forecastCol);
        forecastCol.append(forecastCard);
        forecastCard.append(forecastCardTitle, forecastCardData);
        forecastCardData.append(
          forecastWeatherIcon,
          forecastTemp,
          forecastHumidity
        );
      }
    });
  }
});
