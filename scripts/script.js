$(document).ready(function () {
  //add search button functionality
  $("#search-button").on("click", function () {
    var cityName = $("#search-value").val();
    console.log(cityName);
    // Denver
    //append searched cities below search box

    // clear search box
    // $("#search-value").val("");

    searchWeather(cityName);
  });

  var apiKey = "74fef4641e0974b5f048a0fe6206abb8";

  function searchWeather(cityName) {
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
      console.log(response);

      // make another ajax call for one call api aka for the uvi and feed in the lat and lon from the current weather data api response

      //variables for data to display on current weather card
      var city = response.name;
      var temp = response.main.temp;
      var humidity = response.main.humidity;
      var wind = response.wind.speed;

      //Create HTML elements for current weather
      var current = $("#current");
      var currentCard = $("<div>").addClass("card");
      var currentCardTitle = $("<h3>").addClass("card-title").text(city);
      var weatherIcon = $("<img>").attr(
        "src",
        "http://openweathermap.org/img/wn/" + response.weather[0].icon + ".png"
      );
      var currentCardData = $("<ul>")
        .addClass("card-text mx-3 mb-3")
        .attr("id", "currentData");
      var currentTemp = $("<p>").text("Temperature: " + temp);
      var currentHumidity = $("<p>").text("Humidity: " + humidity + "%");
      var currentWind = $("<p>").text("Wind Speed: " + wind + " MPH");

      //Append current weather card and contents to the page
      current.append(currentCard);
      currentCard.append(currentCardTitle);
      currentCardTitle.append(weatherIcon);
      currentCard.append(currentCardData);
      currentCardData.append(currentTemp, currentHumidity, currentWind);
    });
  }
});
//https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={your api key}
//https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={your api key}
//https://api.openweathermap.org/data/2.5/forecast?q={city name}&appid={your api key}

// Scope in a function

//   console.log(response); //won't work out here
//   $.ajax({
//     url: URLFor5Day,
//   });
// }
