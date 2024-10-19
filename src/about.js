function manuallyChangeBackground(weatherType) {
  // Match the weather type to a weather code
  console.log(`Changing the background to match ${weatherType}.`)
  let weatherCode;
  if (weatherType == 'thunderstorm') {
    weatherCode = 200; // Thunderstorm
  } else if (weatherType == 'drizzle') {
    weatherCode = 300; // Drizzle
  } else if (weatherType == 'rain') {
    weatherCode = 500; // Rain
  } else if (weatherType == 'snow') {
    weatherCode = 600; // Snow
  } else if (weatherType == 'atmosphere') {
    weatherCode = 700; // Atmosphere
  } else if (weatherType == 'clear') {
    weatherCode = 800; // Weather
  } else if (weatherType == 'clouds') {
    weatherCode = 801; // Clouds
  } else if (weatherType == 'hoa hoa hoa') {
    weatherCode = 999; 
  } else {
    weatherCode = 900; // Default
  }
  // Create artificial weather data object containing the weather code
  const weatherData = {
    weather: [{id: weatherCode}]
  }
  // Change the background using the weather data
  changeBackgroundAccordingToWeather(weatherData);
}

