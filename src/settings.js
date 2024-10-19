function setSettings(units) {
  const settings = {
    units: units
  }
  localStorage.setItem("settings", JSON.stringify(settings)); 
}

async function getSettings() {
  return await localStorage.getItem("settings").then((json) => {
    return JSON.parse(json);
  }).catch((error) => { 
    console.log(error); 
  });
}