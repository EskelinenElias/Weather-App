// Function for getting weather data for the current location of the user
async function getWeatherDataForCurrentLocation(units) {
  if (!units) {
    const settings = await getSettings();
    units = settings.units; 
  }
  return await getLocation().then((locationData) => { 
    if (!locationData) { throw new Error("Could not get location data.") }
    return getWeatherData(locationData, units);
  }).catch((error) => {
    console.log(error);
  }); 
}

// Function for getting the default weather data
async function getDefaultWeatherData(units) {
  if (!units) {
    const settings = await getSettings();
    units = settings.units; 
  }
  const locationData = { name: "Helsinki" }
  return getWeatherData(locationData, units);
}

// Function that returns the most relevant weather data quickly, usually for loading page content
async function getRelevantWeatherData() {
  return await getExistingWeatherData().then((weatherData) => {
    if (weatherData) {
      return weatherData;
    }
    return getWeatherDataForCurrentLocation().then((weatherData) => {
      if (weatherData) {
        setExistingWeatherData(weatherData);
        return weatherData;
      }
      return getDefaultWeatherData(); 
    });
  });
}

// Function for parsing location data for API calls
function parseLocationData(locationData) {
  if (locationData.lat && locationData.lon || locationData.latitude && locationData.longitude) {
    const latitude = locationData.lat || locationData.latitude;
    const longitude = locationData.lon || locationData.longitude;
    return `lat=${latitude}&lon=${longitude}`; 
  } else if (locationData.coord || locationData.coords) {
    const coordinates = locationData.coord || locationData.coords;
    const latitude = coordinates.lat || coordinates.latitude;
    const longitude = coordinates.lon || coordinates.longitude; 
    return `lat=${latitude}&lon=${longitude}`; 
  } else if (locationData.name || locationData.cityName) {
    const cityName = locationData.name || locationData.cityName; 
    return `q=${cityName}`; 
  } 
  throw new Error("Could not parse location data.")
}

// Function for fetching weather data
async function getWeatherData(locationData, units) {
  if (!locationData) { throw new Error("Location data was not provided."); }
  // Parse location data 
  const location = parseLocationData(locationData);
  // Construct URL
  const url = `https://api.openweathermap.org/data/2.5/weather?${location}&appid=${OWM_APIKey}&units=${units}`;
  // Fetch weather data
  return fetch(url).then((response) => {
    if (!response.ok) { throw new Error('Failed to fetch weather data.'); }
    return response.json();
  }).then((data) => {
    if (!data) { throw new Error('Failed to parse weather data.'); }
    return data;
  });
}

// Function for fetching hourly forecast data
async function getHourlyForecastData(locationData, numItems, units) {
  if (!locationData) { throw new Error("Location data was not provided."); }
  // Parse location data 
  const location = parseLocationData(locationData); 
  // Construct URL
  const url = `https://api.openweathermap.org/data/2.5/forecast?${location}&cnt${numItems}&appid=${OWM_APIKey}&units=${units}`;
  // Fetch forecast data
  return fetch(url).then((response) => { 
    if (!response.ok) { throw new Error('Failed to fetch hourly forecast data'); }
    return response.json();
  }).then((data) => { 
    if (!data) { throw new Error('Failed to parse hourly forecast data'); }
    return data; 
  }); 
}

// Function for fetching daily forecast data
async function getDailyForecastData(locationData, numDays, units) {
  if (!locationData) { throw new Error("Location data was not provided."); }
  // Parse location data 
  const location = parseLocationData(locationData); 
  // Construct URL
  const url = `https://api.openweathermap.org/data/2.5/forecast?${location}&cnt${numDays}&appid=${OWM_APIKey}&units=${units}`;
  // Fetch daily forecast data
  return fetch(url).then((response) => { 
    if (!response.ok) { throw new Error('Failed to fetch daily forecast data'); }
    return response.json();
  }).then((data) => { 
    if (!data) { throw new Error('Failed to parse daily forecast data'); }
    return data; 
  }); 
}

// Parse location data for Weather API calls
function parseLocationDataOther(locationData) {
  if (locationData.lat && locationData.lon || locationData.latitude && locationData.longitude) {
    const latitude = locationData.lat || locationData.latitude;
    const longitude = locationData.lon || locationData.longitude;
    return `q=${latitude},${longitude}`; 
  } else if (locationData.coord || locationData.coords) {
    const coordinates = locationData.coord || locationData.coords;
    const latitude = coordinates.lat || coordinates.latitude;
    const longitude = coordinates.lon || coordinates.longitude; 
    return `q=${latitude},${longitude}`; 
  } else if (locationData.name || locationData.cityName) {
    const cityName = locationData.name || locationData.cityName; 
    return `q=${cityName}`; 
  } 
  throw new Error("Could not parse location data.")
}

// Function for getting the units in Weather API format
function chooseUnitsOther(units) {
  if (units === "imperial") { return "f"; } 
  else { return "c"; }
}

// Function for getting hourly forecast data from Weather API
async function getOtherHourlyForecast(locationData, days, units) {
  if (!locationData) { throw new Error("Location data was not provided."); }
  // Parse location data 
  const location = parseLocationDataOther(locationData); 
  // Choose units
  const unit = chooseUnitsOther(units); 
  // Construct URL
  const url = `http://api.weatherapi.com/v1/forecast.json?key=${WeatherAPIKey}&${location}&days=${days}&units=${unit}`
  // Fetch forecast data    const data = await response.json();
  return fetch(url).then((response) => {
    if (!response.ok) { throw new Error('Failed to fetch hourly forecast data from Weather API.'); }
    return response.json();
  }).then((data) => {
    if (!data) { throw new Error('Failed to parse hourly forecast data from Weather API.'); }
    return data;
  }); 
}

// Function to map weather code or condition to Font Awesome icons
function getWeatherIcon(input, size = 'fa-3x') {
  let iconCode;

  if (typeof input === 'number') {
    // Handle weather codes
    if (input >= 200 && input < 300) {
      iconCode = `fas fa-bolt ${size}`; // Thunderstorm
    } else if (input >= 300 && input < 400) {
      iconCode = `fas fa-cloud-rain ${size}`; // Drizzle
    } else if (input >= 500 && input < 600) {
      iconCode = `fas fa-cloud-showers-heavy ${size}`; // Rain
    } else if (input >= 600 && input < 700) {
      iconCode = `fas fa-snowflake ${size}`; // Snow
    } else if (input >= 700 && input < 800) {
      iconCode = `fas fa-smog ${size}`; // Atmosphere
    } else if (input === 800) {
      iconCode = `fas fa-sun ${size}`; // Clear sky
    } else if (input > 800 && input < 900) {
      iconCode = `fas fa-cloud ${size}`; // Clouds
    } else {
      iconCode = `fas fa-question ${size}`; // Unknown
    }
  } else if (typeof input === 'string') {
    // Handle weather conditions as strings
    if (input.toLowerCase() === 'clear') {
      iconCode = `fas fa-sun ${size}`;
    } else if (input.toLowerCase() === 'thunderstorm') {
      iconCode = `fas fa-bolt ${size}`;
    } else if (input.toLowerCase() === 'drizzle') {
      iconCode = `fas fa-cloud-rain ${size}`;
    } else if (input.toLowerCase() === 'rain') {
      iconCode = `fas fa-cloud-showers-heavy ${size}`;
    } else if (input.toLowerCase() === 'snow') {
      iconCode = `fas fa-snowflake ${size}`;
    } else if (input.toLowerCase() === 'atmosphere') {
      iconCode = `fas fa-smog ${size}`;
    } else if (input.toLowerCase() === 'clouds') {
      iconCode = `fas fa-cloud ${size}`;
    } else {
      iconCode = `fas fa-question ${size}`; // Unknown
    }
  } else {
    // Default case for unknown input
    iconCode = `fas fa-question ${size}`;
  }
  return iconCode;
}

async function getCoordinates(locationName) {
  if (!locationName) { return; }
  return await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${locationName}&limit=1&appid=${OWM_APIKey}`)
  .then(response => response.json())
  .then(data => {
    if (data && data.length > 0) {
      const coordinates = {
        latitude: data[0].lat,
        longitude: data[0].lon
      } 
      return coordinates; 
    } else {
      alert('Location not found. Please try another search term.');
    }
  }).catch(error => {
    console.error('Error fetching location data:', error);
  });
}


async function getExistingWeatherData() {
  try {
    return await JSON.parse(sessionStorage.getItem("weatherData")); 
  } catch(error) {
    console.log(error); 
  }
}

function setExistingWeatherData(weatherData) {
  sessionStorage.setItem("weatherData", JSON.stringify(weatherData)); 
}