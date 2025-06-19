function setSettings(units) {
  const settings = {
    units: units
  }
  localStorage.setItem("settings", JSON.stringify(settings)); 
  // Update weather data for new units
  getExistingWeatherData().then((locationData) => { 
    if (locationData) {
      getWeatherData(locationData, units).then((weatherData) => { 
        if (weatherData) {
          setExistingWeatherData(weatherData); 
        }
      });
    }
  });
}

async function getSettings() {
  try {
    return await JSON.parse(localStorage.getItem("settings"));
  } catch(error) {
    console.log(error); 
  } 
}

// Set default settings
getSettings().then((settings) => { 
  if (!settings) {
    setSettings("metric")
  }
}); 