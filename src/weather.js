const APIKey = "2b255ed685e131c7835a144acfc6ca6f";

function getWeather(event) {
  event.preventDefault();
  const city = document.getElementById("search-input").value.trim().toLowerCase();
  if (city === "") {
    //displayError("Please enter a city name.");
    //return;
    city = "Helsinki"; 
  }
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}&units=metric`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("City not found");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data); 
      displayWeatherData(data);
    })
    .catch((error) => {
      console.log("Error occurred", error); 
      //displayError(error.message);
    });
}

async function getWeatherByLocationName(locationName) {
  locationName = locationName.trim().toLowerCase(); 
  if (!locationName) {
    return; 
  }
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${locationName}&appid=${APIKey}&units=metric`;
  return await fetch(apiUrl).then((response) => {
    if (!response.ok) {
      throw new Error(`City ${cityName} not found`);
    }
    return response.json();
  }).then((weatherData) => {
    if (weatherData) {
      const locationData = {
        name: locationName,
        latitude: weatherData.coord.lat,
        longitude: weatherData.coord.lon
      }
      setExistingWeatherData(weatherData); 
      return weatherData;
    }
  }).catch((error) => {
    console.log("Error occurred", error); 
  });
}

async function getWeatherDataForLocation(locationData) {
  if (!locationData) {
    return; 
  }
  const latitude = locationData.latitude || locationData.coords.latitude; 
  const longitude = locationData.longitude || locationData.coords.longitude;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${APIKey}&units=metric`;
  return await fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error(`Weather data for coordinates ${latitude}, ${longitude} not found.`);
    }
    return response.json();
  }).then((data) => {
    return data;
  }).catch((error) => {
    console.log("Error occurred", error); 
  });
}

async function getRelevantWeatherData() {
  return await getExistingWeatherData().then((weatherData) => {
    if (weatherData) {
      return weatherData;
    }
    return getLocation().then((locationData) => {
      if (locationData) {
        let weatherData = getWeatherDataForLocation(locationData); 
        if (weatherData) {
          setExistingLocationData(locationData); 
          setExistingWeatherData(weatherData); 
          return weatherData; 
        }
      }
      getCoordinates("Helsinki").then((locationData) => {
        getWeatherDataForLocation(locationData).then((weatherData) => {
          setExistingLocationData(locationData);
          setExistingWeatherData(weatherData);
          return weatherData;
        })
      });
    });
  });
}
async function fetchWeatherDataByCoordinates(coordinates) {
  if (!coordinates) {
    return; 
  }
  const latitude = coordinates.latitude; 
  const longitude = coordinates.longitude; 
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${APIKey}&units=metric`;
  return await fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error(`Weather data for coordinates ${latitude}, ${longitude} not found.`);
    }
    return response.json();
  }).then((data) => {
    return data;
  }).catch((error) => {
    console.log("Error occurred", error); 
  });
}


// Function to map OpenWeatherMap weather codes to Font Awesome icons
function getWeatherIcon(weatherCode, size = 'fa-3x') { // Default size is 'fa-3x'
  let iconCode;
  if (weatherCode >= 200 && weatherCode < 300) {
    // Thunderstorm
    iconCode = `fas fa-bolt ${size}`; // Lightning bolt
  } else if (weatherCode >= 300 && weatherCode < 400) {
    // Drizzle
    iconCode = `fas fa-cloud-rain ${size}`; // Cloud with rain
  } else if (weatherCode >= 500 && weatherCode < 600) {
    // Rain
    iconCode = `fas fa-cloud-showers-heavy ${size}`; // Heavy rain
  } else if (weatherCode >= 600 && weatherCode < 700) {
    // Snow
    iconCode = `fas fa-snowflake ${size}`; // Snowflake
  } else if (weatherCode >= 700 && weatherCode < 800) {
    // Atmosphere (e.g., mist, fog, smoke)
    iconCode = `fas fa-smog ${size}`; // Fog/smog
  } else if (weatherCode === 800) {
    // Clear sky
    iconCode = `fas fa-sun ${size}`; // Sun
  } else if (weatherCode > 800 && weatherCode < 900) {
    // Clouds
    iconCode = `fas fa-cloud ${size}`; // Cloudy
  } else {
    // Default: Unknown weather condition
    iconCode = `fas fa-question ${size}`; // Question mark
  }
  return iconCode;
}

async function getCoordinates(locationName) {
  if (!locationName) { return; }
  return await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${locationName}&limit=1&appid=${APIKey}`)
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