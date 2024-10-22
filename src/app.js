// Function for capitalizing the first letter of a string
function capitalizeFirstLetter(string) {
  if (string.length == 1) {  
    string = string.charAt(0).toUpperCase(); 
  } else if (string.length > 1) {
    string = string.charAt(0).toUpperCase() + string.slice(1); 
  }
  return string;
}

// Function to display weather data
async function displayWeatherData(data) {
  const weatherMain = document.getElementById('weather-main');
  // Parse weather data
  const { name, main, weather } = data;
  const weatherDescription = capitalizeFirstLetter(weather[0].description);
  const temperature = main.temp;
  const feelsLike = main.feels_like;
  const humidity = main.humidity;
  const pressure = main.pressure;
  const weatherCode = weather[0].id;
  // Display the data on the website
  weatherMain.innerHTML = `
    <h2 id="city-name">${name}</h2>
    <div id="weather-description">
      <i id="weather-icon"></i>
      <h1 id="temp-display">${Math.round(temperature)} ${tempUnit}</h1>
    </div>
    <h1 id="weather-description-text">${weatherDescription}</h1>
    <p id="feels-like">Feels Like: ${Math.round(feelsLike)} ${tempUnit}</p>
    <p id="humidity">Humidity: ${Math.round(humidity)} %</p>
    <p id="pressure">Pressure: ${Math.round(pressure)} hPa</p>
  `; 
  // Set weather icon
  const iconCode = getWeatherIcon(weatherCode, "fa-4x");
  document.getElementById('weather-icon').className = iconCode; 
}

// Function for showing the user that locating the user is in progress
function displayCurrentlyLocatingStatus() {
  weatherMain.innerHTML = `<h3>Locating...</h3>`;
}

// Function for displaying forecast data
function displayHourlyForecast(forecastData) {
  if (!forecastData) { throw new Error("Hourly forecast data was not provided."); }
  // Clear forecast display
  const forecastContainer = document.getElementById('hourly-forecast-container');
  forecastContainer.innerHTML = '';
  // Parse forecast data
  const forecastList = forecastData.list.slice(0, 8); 
  // Display forecast data
  forecastList.forEach(forecast => {
    // Create new forecast item
    const forecastItem = document.createElement('div');
    forecastItem.classList.add('forecast-item');
    // Add forecast time
    const timeElement = document.createElement('p');
    const timeData = new Date(forecast.dt_txt).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
    timeElement.textContent = timeData;
    console.log(forecast.time)
    forecastItem.appendChild(timeElement);
    // Add forecast temperature
    const tempElement = document.createElement('p');
    const tempData = Math.round(forecast.main.temp); 
    tempElement.textContent = `${tempData} ${tempUnit}`;
    forecastItem.appendChild(tempElement);
    // Add weather icon
    const weatherCondition = forecast.weather[0].main; 
    const iconClass = getWeatherIcon(weatherCondition);
    const iconElement = document.createElement('i');
    iconElement.className = iconClass; // Set Font Awesome icon class
    forecastItem.appendChild(iconElement);
    // Add forecast item to forecast display
    forecastContainer.appendChild(forecastItem);
  });
}


// Global variables
let units = "metric"; 
let tempUnit = "° C"; 

// Load page
document.addEventListener("DOMContentLoaded", async () => {
  // Get settings
  await getSettings().then((settings) => {
    if (!settings || !settings.units) {
      console.log("Failed to load settings.")
      return; 
    }
    units = settings.units;
    if (units === "metric") {
      tempUnit = "° C"; 
    } else {
      tempUnit = "° F";
    }
  });
  // Populate page with existing weather data
  getRelevantWeatherData().then((weatherData) => {
    if (!weatherData) { throw new Error("Could not get relevant weather data"); }
    displayWeatherData(weatherData);
    return weatherData; 
  }).then((locationData) => { 
    // Load fresh weather data
    getWeatherData(locationData, units).then((weatherData) => {
      if (!weatherData) { throw new Error("Failed to get weather data."); }
      // Display existing data
      displayWeatherData(weatherData);
      changeBackgroundAccordingToWeather(weatherData);
      // Store weather data for later use
      setExistingWeatherData(weatherData);
    }).then((weatherData) => {
      changeBackgroundAccordingToWeather(weatherData);
    }); 
    // Load hourly forecast
    getHourlyForecastData(locationData, 8, units).then((forecastData) => {
      if (!forecastData) {
        throw new Error("Could not get forecast data.")
      }
      displayHourlyForecast(forecastData); 
    });
  }); 
}); 