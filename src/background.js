// Function changing the page background
function changeBackground(newBackground) {
  const background1 = document.querySelector('.background1');
  const background2 = document.querySelector('.background2');
  if (background1.style.opacity == 1) {
    // Background1 is currently visible, fade it out and background2 in
    background2.style.backgroundImage = newBackground;
    background2.style.opacity = 1;
    background1.style.opacity = 0;
  } else {
    // Background2 is currently visible, fade it out and background1 in
    background1.style.backgroundImage = newBackground;
    background1.style.opacity = 1;
    background2.style.opacity = 0;
  }
  sessionStorage.setItem("backgroundGradient", newBackground); 
}

// Function for changing the color of the elements 
async function changeElementColor(color) {
  if (!color) { return; }
  // Change element colors
  if (color === 'black') {
    document.documentElement.style.setProperty('--header-text-color', 'rgba(0, 0, 0, 0.9)');
    document.documentElement.style.setProperty('--info-text-color', 'rgba(0, 0, 0, 0.9)');
    document.documentElement.style.setProperty('--search-form-background-color', 'rgba(0, 0, 0, 0.2)');
    document.documentElement.style.setProperty('--search-form-placeholder-color', 'rgba(0, 0, 0, 0.6)');
  } else { // Color is probably white
    document.documentElement.style.setProperty('--header-text-color', 'rgba(255, 255, 255, 0.9)');
    document.documentElement.style.setProperty('--info-text-color', 'rgba(255, 255, 255, 0.9)');
    document.documentElement.style.setProperty('--search-form-background-color', 'rgba(255, 255, 255, 0.2)');
    document.documentElement.style.setProperty('--search-form-placeholder-color', 'rgba(255, 255, 255, 0.6)');
  }
}

// Function for changing the background according to weather data
function changeBackgroundAccordingToWeather(weatherData) {
  if (!weatherData || !weatherData.weather[0].id) {
    console.log("Can't change background.")
    return; 
  }
  // Parse weather data
  const weatherCode = weatherData.weather[0].id; 
  // Choose new gradient background according to the weather
  let newGradient;
  let textColor;
  if (weatherCode >= 200 && weatherCode < 300) {
    newGradient = 'linear-gradient(to right, #4b0082, #000000)'; // Thunderstorm
    textColor = 'white';
  } else if (weatherCode >= 300 && weatherCode < 400) {
    newGradient = 'linear-gradient(to right, #d3d3d3, #1e90ff)'; // Drizzle
    textColor = 'black';
  } else if (weatherCode >= 500 && weatherCode < 600) {
    newGradient = 'linear-gradient(to right, #003366, #a9a9a9)'; // Rain
    textColor = 'white';
  } else if (weatherCode >= 600 && weatherCode < 700) {
    newGradient = 'linear-gradient(to right, #ffffff, #87cefa)'; // Snow
    textColor = 'black';
  } else if (weatherCode >= 700 && weatherCode < 800) {
    newGradient = 'linear-gradient(to right, #87cefa, #f0f8ff)'; // Atmosphere
    textColor = 'black';
  } else if (weatherCode === 800) {
    newGradient = 'linear-gradient(to right, #87ceeb, #1e90ff)'; // Clear
    textColor = 'white';
  } else if (weatherCode >= 801 && weatherCode < 900) {
    newGradient = 'linear-gradient(to right, #b0c4de, #f0f8ff)'; // Clouds
    textColor = 'black';
  } else if (weatherCode >= 900) {
    newGradient = 'linear-gradient(to right, #2E3A4D, #3B6A65)'; // Hoa hoa hoa
    textColor = 'white'; 
  } else {
    newGradient = 'linear-gradient(to right, #87ceeb, #1e90ff)'; // Default; same as Clear
    textColor = 'white'; 
  }
  // If chosen gradient is not the same as the current gradient, change gradient
  getExistingStyle().then((style) => {
    if (!style || !style.gradient || style.gradient != newGradient) {
      changeBackground(newGradient);
      changeElementColor(textColor);
      setExistingStyle({
        gradient: newGradient,
        textColor: textColor
      });
    }
  });
}

// Function for loading the existing style choices from storage
async function getExistingStyle() {
  return await JSON.parse(sessionStorage.getItem("style")); 
}

// Function for saving the style choices to storage
function setExistingStyle(style) {
  sessionStorage.setItem("style", JSON.stringify(style)); 
}

// Load page
document.addEventListener("DOMContentLoaded", () => {
  getExistingStyle().then((style) => {
    if (style) {
      changeBackground(style.gradient);
      changeElementColor(style.textColor);
    } else {
      setExistingStyle({
        gradient: 'linear-gradient(to right, #87ceeb, #1e90ff)',
        textColor: 'white'
      });
    }
    setTimeout(() => {
      document.documentElement.style.setProperty('--search-form-transition', 'border 1s ease-in-out, background 1s ease-in-out, color 1s ease-in-out');
      document.documentElement.style.setProperty('--elements-transition', 'color 1s ease-in-out');
      document.documentElement.style.setProperty('--backgrounds-transition', 'opacity 1s ease-in-out');
    }, 100)
  });
});