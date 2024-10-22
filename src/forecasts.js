// Function for capitalizing the first letter of a string
function capitalizeFirstLetter(string) {
  if (string.length == 1) {  
    string = string.charAt(0).toUpperCase(); 
  } else if (string.length > 1) {
    string = string.charAt(0).toUpperCase() + string.slice(1); 
  }
  return string;
}

// Function for displaying  hourly forecast
function displayHourlyForecastData(forecastData) {
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
    iconElement.className = iconClass; 
    forecastItem.appendChild(iconElement);
    // Add forecast item to forecast display
    forecastContainer.appendChild(forecastItem);
  });
}

// Function to calculate average temperature per day from the forecast data
function createDailyForecast(forecastData) {
  const forecastList = forecastData.list || forecastData; 
  // Collect daily temperatures
  const dailyData = {};
  forecastList.forEach(forecast => {
    // Get the date and temperature
    const key = forecast.dt_txt.split(' ')[0];
    const temp = forecast.main.temp;
    const date = new Date(key).toLocaleTimeString('en-GB', {weekday: 'short', month: 'short', day: 'numeric'});
    const condition = forecast.weather[0].main; 
    // If this date hasn't been added yet, initialize it
    if (!dailyData[key]) { 
      dailyData[key] = { 
        date: date.split(" at ")[0],
        temp: {sum: 0, count: 0}, 
        conditions: {}
      }; 
    }
    // Collect conditions
    if (!dailyData[key].conditions[condition]) {
      dailyData[key].conditions[condition] = 0; 
    }
    dailyData[key].conditions[condition] += 1; 
    // Add the temperature to the sum and increment the count
    dailyData[key].temp.sum += temp;
    dailyData[key].temp.count += 1;
  });
  // Construct daily forecast
  const dailyForecast = {};
  Object.keys(dailyData).forEach(key => {
    // Find the most common condition
    let condition = ""; 
    let count = 0; 
    Object.keys(dailyData[key].conditions).forEach(cond => {
      if (dailyData[key].conditions[cond] > count) {
        condition = cond; 
      }
    }); 
    // Construct daily forecast item
    dailyForecast[key] = {
      date: dailyData[key].date,
      temp: dailyData[key].temp.sum / dailyData[key].temp.count,
      condition: condition
    }
  });
  return dailyForecast;
}

// Display daily forecast data
function displayDailyForecastData(forecastData) {
  if (!forecastData) { throw new Error("Daily forecast data was not provided."); }
  // Clear forecast display
  const forecastContainer = document.getElementById('daily-forecast-container');
  forecastContainer.innerHTML = '';
  // Parse forecast data and calculate daily averages
  const dailyForecast = createDailyForecast(forecastData); 
  // Display forecast data
  Object.keys(dailyForecast).forEach(key => {
    // Create new forecast item
    const forecastItem = document.createElement('div');
    forecastItem.classList.add('forecast-item');
    // Add forecast time
    const timeElement = document.createElement('p');
    const timeData = dailyForecast[key].date; 
    timeElement.textContent = timeData;
    forecastItem.appendChild(timeElement);
    // Add forecast temperature
    const tempElement = document.createElement('p');
    const tempData = Math.round(dailyForecast[key].temp); 
    tempElement.textContent = `${tempData} ${tempUnit}`;
    forecastItem.appendChild(tempElement);
    // Add weather icon
    const weatherCondition = dailyForecast[key].condition; 
    const iconClass = getWeatherIcon(weatherCondition);
    const iconElement = document.createElement('i');
    iconElement.className = iconClass; 
    forecastItem.appendChild(iconElement);
    // Add forecast item to forecast display
    forecastContainer.appendChild(forecastItem);
  });
}

// Create 
function create24HourForecastForPlot(forecastData, units) {
  if (!forecastData) { throw new Error("Forecast data was not provided."); }
  if (forecastData.list) {
    const data = { labels: [], datasets: [{ name: "OpenWeatherMap", values: [] }] };
    // OpenWeatherMap forecast
    forecastData.list.slice(0, 8).forEach((forecast) => {
      const date = new Date(forecast.dt * 1000);
      const hours = date.getHours(); 
      const temp = forecast.main.temp; 
      data.labels.push(hours);
      data.datasets[0].values.push(temp);
    });
    return data; 
  } else if (forecastData.forecast) {
    // Weather API forecast
    const data = { labels: [], datasets: [{ name: "Weather API", values: [] }] };
    // Get current time
    const currentHour = new Date().getHours(); 
    // Get the correct hours from the forecast
    const todayHours = forecastData.forecast.forecastday[0].hour.slice(currentHour); 
    const tomorrowHours = forecastData.forecast.forecastday[1].hour.slice(0, 24 - todayHours.length);
    const next24Hours = [...todayHours, ...tomorrowHours];
    // Get correct data
    for (i = 0; i < next24Hours.length; i=i+1) {
      const forecast = next24Hours[i]; 
      const date = new Date(forecast.time);
      const hours = date.getHours();
      const temp = forecast.temp_c; 
      data.labels.push(hours); 
      data.datasets[0].values.push(temp);
    }  
    return data; 
  } else {
    throw new Error("Could not create 24 hour forecast from provided data.", forecastData); 
  }
}

function plot24HourForecast(data, units) {
  if (!data) { throw new Error("Chart data was not provided."); }
  const color = document.documentElement.style.getPropertyValue('--chart-line-color');
  // Create a new Frappe chart 
  chart = new frappe.Chart("#temp-chart", {
    title: "Temperature forecast for the next 24 hours",
    data: data,
    type: 'line',
    height: 450,
    colors: [color], 
    axisOptions: {
      xAxisMode: 'tick', 
      yAxisMode: 'span',
    },
    lineOptions: {
      strokeWidth: 2, 
      hideDots: 1, 
      heatline: 1 
    },
    axisOptions: {
      xAxisColor: color,
      yAxisColor: color, 
      axisLabelColor: color, 
      xAxisMode: 'tick', 
      yAxisMode: 'span'
    },
    title: {
      color: color,
    },
  });
}

// Global variables
let units = "metric"; 
let tempUnit = "° C"; 
let chart;

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
  getRelevantWeatherData().then((weatherData, units) => {
    if (!weatherData) { 
      throw new Error("Could not get relevant weather data.")
    }
    document.getElementById("forecasts-header").innerText = capitalizeFirstLetter(`Forecasts for ${weatherData.name}`);
    return weatherData;
  }).then((locationData) => {
    // Load fresh weather data
    getWeatherData(locationData, units).then((weatherData) => {
      if (!weatherData) {  throw new Error("Failed to get weather data."); }
      // Display existing data
      changeBackgroundAccordingToWeather(weatherData);
      document.getElementById("forecasts-header").innerText = `Forecasts for ${weatherData.name}`;
      // Store weather data for later use
      setExistingWeatherData(weatherData);
    }); 
    // Load forecast data
    getHourlyForecastData(locationData, 8, units).then((forecastData) => {
      if (!forecastData) {
        throw new Error("Failed to get forecast data.");
      }
      // Display forecast data
      displayHourlyForecastData(forecastData);
      displayDailyForecastData(forecastData);
      return forecastData;
    });
    // Load more accurate forecast data for the plot
    getOtherHourlyForecast(locationData, 2, units).then((forecastData) => {
      if (!forecastData) {
        throw new Error("Failed to get other forecast data."); 
      }
      // Plot forecast data
      const data = create24HourForecastForPlot(forecastData, units); 
      plot24HourForecast(data, units);
    });
  }); 
}); 