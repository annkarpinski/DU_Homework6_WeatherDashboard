$(document).ready(function () {
  // localStorage.clear();
  //variable to hold user city searches
  var searchHistory = [];

  // Every time page refreshes, grab cities from local storage
  // Parsing the JSON string to an object
  var storedCities = JSON.parse(localStorage.getItem("cityName"));

  // If cities were retrieved from localStorage, update the cities array to it
  if (storedCities !== null) {
    searchHistory = storedCities;
  }

  function renderCities() {
    // Clear history list element
    $("#history").empty();

    // Render a new li for each city
    for (var i = 0; i < searchHistory.length; i++) {
      var city = searchHistory[i];

      var li = $("<li>");
      li.text(city);
      li.addClass("list-group-item list-group-item-action");
      li.attr("data-name", city);

      $("#history").prepend(li);
    }
  }

  //add search button functionality and allow hitting Enter to enable click button
  $("#search-button").on("click", function (event) {
    event.preventDefault();
    var cityName = $("#search-value").val();

    //push cityName to searchHistory array upon user click on Search button
    //save to localStorage
    //then display searchHistory array as new list in #history
    if (searchHistory.indexOf(cityName) === -1) {
      searchHistory.push(cityName);
      localStorage.setItem("cityName", JSON.stringify(searchHistory));
      renderCities();
    }

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
      //api returns forecast every 3 hours, so get forecast data for 3:00pm each day
      //first forecast day for 3:00pm is at index 6 and adding 8 indices to get to 3:00pm the next day
      for (i = 6; i < response.list.length; i += 8) {
        //variables for data to display on 5-day forecast weather cards
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

  // Render the array of cities to the history <ul>
  renderCities();

  // Adding a click event listener to all cities in history
  $(document).on("click", "li", function () {
    // console.log(event.target.textContent);
    var cityName = $(this).attr("data-name");
    currentWeather(cityName);
    fiveDayForecast(cityName);
  });
});
