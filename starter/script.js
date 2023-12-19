// Selecting elements from the HTML using jQuery
var sectionToday = $("#today");
var asideHistory = $("#history");
var sectionForecast = $("#forecast");

// Retrieving search history from local storage or initializing an empty array
var userChoiceCity = JSON.parse(localStorage.getItem("searchHistory")) || [];

// Populating search history buttons
for (let j = 0; j < userChoiceCity.length; j++) {
  const buttonCity = $("<button>");
  buttonCity.text(userChoiceCity[j]);
  asideHistory.append(buttonCity);
}

// Event listener for the search button
$("#search-button").on("click", function (event) {
  // Preventing the default behavior of the page (reload)
  event.preventDefault();

  // Retrieving user input for the city, API key, and constructing URLs for current weather and forecast
  var city = $("#search-input").val();
  var apiKey = "5da72ee67b0e65bab7975604b2d27194";
  var currentWeatherUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=metric" +
    "&appid=" +
    apiKey;

  var forecastUrl =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&units=metric" +
    "&appid=" +
    apiKey;

  // Fetching current weather data
  fetch(currentWeatherUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // Clearing existing content in the sectionToday
      sectionToday.empty();

      // Creating elements for current weather information
      const cityName = $("<h3>");
      const weatherIcon = $("<img>");
      const temp = $("<p>");
      const wind = $("<p>");
      const humidity = $("<p>");

      // Extracting weather icon code and setting attributes
      var weatherIconCode = data.weather[0].icon;
      weatherIcon.attr(
        "src",
        "https://openweathermap.org/img/wn/" + weatherIconCode + ".png"
      );

      // Setting text content for each element
      cityName.text(data.name + " " + dayjs().format("(D/M/YYYY)"));
      temp.text("Temp: " + data.main.temp + " °C");
      wind.text("Wind: " + data.wind.speed + " KPH");
      humidity.text("Humidity: " + data.main.humidity + " %");

      // Adding classes and appending elements to sectionToday
      sectionToday.addClass("card");
      sectionToday.append(cityName);
      cityName.append(weatherIcon);
      sectionToday.append(temp, wind, humidity);

      // Adding the searched city to the user's search history
      userChoiceCity.push(city);
      localStorage.setItem("searchHistory", JSON.stringify(userChoiceCity));
      asideHistory.empty();

      // Creating buttons for each city in the search history
      for (let j = 0; j < userChoiceCity.length; j++) {
        const buttonCity = $("<button>");
        asideHistory.addClass("d-grid gap-2 mx-auto");
        buttonCity.addClass("btn btn-primary");
        buttonCity.text(userChoiceCity[j]);
        asideHistory.append(buttonCity);
      }

      // Label for 5-day forecast
      const label = $("<h4>");
      label.text("5-Day Forecast: ");
      sectionForecast.append(label);

      // Fetching 5-day forecast data
      fetch(forecastUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          // Looping through 5 data points for the forecast
          for (let i = 0; i < 5; i++) {
            const forecastData = data.list[i * 8];

            // Creating elements for each forecast day
            const forecastDate = $("<h5>");
            const forecastWeatherIcon = $("<img>");
            const forecastTemp = $("<p>");
            const forecastWind = $("<p>");
            const forecastHumidity = $("<p>");

            // Setting attributes and text content
            var forecastWeatherIconCode = forecastData.weather[0].icon;
            forecastWeatherIcon.attr(
              "src",
              "https://openweathermap.org/img/wn/" +
                forecastWeatherIconCode +
                ".png"
            );
            forecastWeatherIcon.css("width", "50px");

            forecastDate.text(forecastData.dt_txt);
            forecastTemp.text("Temp: " + forecastData.main.temp + " °C");
            forecastWind.text("Wind: " + forecastData.wind.speed + " KPH");
            forecastHumidity.text(
              "Humidity: " + forecastData.main.humidity + " %"
            );

            // Creating a new div to hold each day's forecast and adding classes
            const forecastDayDiv = $("<div>");
            forecastDayDiv.addClass("card col-sm-6 col-md-2");

            // Appending elements to the forecastDayDiv
            forecastDayDiv.append(
              forecastDate,
              forecastWeatherIcon,
              forecastTemp,
              forecastWind,
              forecastHumidity
            );

            // Appending the forecastDayDiv to the sectionForecast
            sectionForecast.append(forecastDayDiv);
          }
        });

      // Clearing existing content in the sectionForecast
      sectionForecast.empty();
    });
});
