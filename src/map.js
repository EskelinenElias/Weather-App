// Function for changing the location on the map
function changeMapLocation(locationData) {
  if (!locationData) {
    return; 
  }
  // Parse locationData
  const latitude = locationData.latitude || locationData.coord.lat;
  const longitude  = locationData.longitude || locationData.coord.lon;
  // Set map view
  map.flyTo([latitude, longitude], 13); 
  marker.setLatLng([latitude, longitude]); 
}

// Constants
let map; 
let marker; 

// Load page
document.addEventListener("DOMContentLoaded", () => {
  getRelevantWeatherData().then((weatherData) => {
    if (!weatherData) { return; }
    // Change background to match the weather
    changeBackgroundAccordingToWeather(weatherData);
    // Parse location data
    const latitude = weatherData.coord.lat;
    const longitude = weatherData.coord.lon;
    // Initialize map
    map = L.map('map').setView([latitude, longitude], 13);
    // Add map
    const mapLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors & CartoDB'
    })
    // Add clouds
    const cloudsLayer = L.tileLayer(`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${APIKey}`, {
      maxZoom: 19,
      attribution: 'Clouds data © OpenWeatherMap'
    });
    // Add rain
    const precipitationLayer = L.tileLayer(`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${APIKey}`, {
      maxZoom: 19,
      attribution: 'Precipitation data © OpenWeatherMap'
    });
    // Add temperature
    const tempLayer = L.tileLayer(`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${APIKey}`, {
      maxZoom: 19,
      attribution: 'Temperature data © OpenWeatherMap'
    });
    // Add wind
    const windLayer = L.tileLayer(`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${APIKey}`, {
      maxZoom: 19,
      attribution: 'Wind data © OpenWeatherMap'
    });
    // Add pressure
    const pressureLayer = L.tileLayer(`https://tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid=${APIKey}`, {
      maxZoom: 19,
      attribution: 'Pressure data © OpenWeatherMap'
    });
    // Add snow
    const snowLayer = L.tileLayer(`https://tile.openweathermap.org/map/snow_new/{z}/{x}/{y}.png?appid=${APIKey}`, {
      maxZoom: 19,
      attribution: 'Snow data © OpenWeatherMap'
    });
    // Add layers to map
    mapLayer.addTo(map);
    cloudsLayer.addTo(map);
    // Add layer controls
    L.control.layers({
      "Clouds": cloudsLayer,
      "Precipitation": precipitationLayer,
      "Temperature": tempLayer,
      "Wind": windLayer,
      "Pressure": pressureLayer,
      "Snow": snowLayer
    }).addTo(map);
    // Add a marker for the user's location
    marker = L.marker([latitude, longitude]).addTo(map);
  });
}); 