// weatherService.js
export const fetchWeatherData = async (city) => {
  const apiKey = "b2e130707c8cd78c8f57f07ada3b08fc";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Error: ${response.status} - ${response.statusText}`);
      throw new Error("Weather data not available");
    }

    const data = await response.json();
    
    return {
      location: data.name,
      temperature: Math.round(data.main.temp - 273.15), 
      condition: data.weather[0].main,
      description: data.weather[0].description,
      code: data.weather[0].id,
    };
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    throw error;
  }
};

// timeService.js
export const fetchTimeData = async (location) => {
  try {
    const apiKey = "b2e130707c8cd78c8f57f07ada3b08fc"; 
    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`);
    if (!response.ok) throw new Error("Time data not available");

    const data = await response.json();
    const localTime = new Date(data.location.localtime);
    const hour = localTime.getHours();
    return { 
      isDaytime: hour >= 6 && hour < 18,
      localTime 
    };
  } catch (error) {
    console.error("Error fetching time data:", error);
    throw error;
  }
};

// uiService.js
export const getBackgroundStyle = (weatherCode, isDaytime) => {
  const gradients = {
    daytime: {
      clear: "linear-gradient(to right bottom, #ff8c00, #ff6b6b)",
      cloudy: "linear-gradient(to right bottom, #4ca1af, #c4e0e5)",
      rainy: "linear-gradient(to right bottom, #606c88, #3f4c6b)",
      storm: "linear-gradient(to right bottom, #373b44, #4286f4)",
    },
    nighttime: {
      clear: "linear-gradient(to right bottom, #2c3e50, #3498db)",
      cloudy: "linear-gradient(to right bottom, #203a43, #2c5364)",
      rainy: "linear-gradient(to right bottom, #1f1c2c, #928dab)",
      storm: "linear-gradient(to right bottom, #0f2027, #203a43)",
    }
  };

  const timeOfDay = isDaytime ? 'daytime' : 'nighttime';
  
  // Weather condition mapping
  if (weatherCode === 1000) return gradients[timeOfDay].clear; // Clear
  if (weatherCode >= 1001 && weatherCode <= 1009) return gradients[timeOfDay].cloudy; // Cloudy
  if (weatherCode >= 1150 && weatherCode <= 1201) return gradients[timeOfDay].rainy; // Rain
  if (weatherCode >= 1273) return gradients[timeOfDay].storm; // Storm
  
  return gradients[timeOfDay].clear; // Default to clear
};

// localStorageService.js remains the same
export const getStoredData = (key) => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    return null;
  }
};

export const setStoredData = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error('Error setting localStorage:', error);
  }
};