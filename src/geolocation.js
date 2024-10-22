// Function for getting the current location of the user
async function getLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        if (!position) {
          console.log("No position")
        }
        const coordinates = position.coords;
        resolve(coordinates);
      }, (error) => {
        reject(error);
      });
    } else {
      reject(new Error('Geolocation is not supported by your browser'));
    }
  }); 
}

function getDefaultLocation() {
  return getCoordinates("Helsinki");
}

// Function for getting the relevant location data, usually when DOM content is loaded
// If location data has been saved in storage, the existing data is used
// If not, locating the user will be attempted
// If finding the user's location fails, default location is used (Helsinki)
async function getRelevantLocationData() {
  try {
    let locationData;  
    // Check if location data already exists
    locationData = await getExistingLocationData(); 
    if (locationData) {
      console.log("Using existing location data.")
      return locationData; 
    }
  // Try to locate user
    locationData = await getLocation(); 
    if (locationData) {
      console.log("Using new location data.")
      setExistingLocationData(locationData);
      return locationData;
    }
    // Fall back to default location data 
    locationData = await getCoordinates("Helsinki");
    if (locationData) {
      console.log("Using default location data.")
      setExistingLocationData(locationData);
      return locationData;
    } 
  } catch(error) {
    console.log(error)
  }
}