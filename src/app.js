const form = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const weatherMain = document.getElementById('weather-main');
const weatherContainer = document.getElementById('weather-container');
const locateButton = document.getElementById('locate-button'); 

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
function displayWeatherData(data) {
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
      <h1 id="temp-display">${Math.round(temperature)} °C</h1>
    </div>
    <h1 id="weather-description-text">${weatherDescription}</h1>
    <p id="feels-like">Feels Like: ${Math.round(feelsLike)} °C</p>
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

// Load page
document.addEventListener("DOMContentLoaded", () => {
  getRelevantWeatherData().then((weatherData) => {
    if (weatherData) {
      displayWeatherData(weatherData);
      changeBackgroundAccordingToWeather(weatherData);
    } else {
      console.log("Failed to get weather data.")
    }
  });
}); 