import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import day from './lib/day.jpg'; 
import night from './lib/night.jpg';  

const App = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [location, setLocation] = useState('');
  const [lastVisited, setLastVisited] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchInput, setSearchInput] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const defaultCities = [
    { name: 'Lucknow', icon: '🌞' } ,
    { name: 'Delhi', icon: '🌤️' },
    { name: 'Bangalore', icon: '🌦️' },
    { name: 'Mumbai', icon: '🌧️' },
    { name: 'London', icon: '🌦️' },
    { name: 'New York', icon: '🗽' },
    { name: 'Paris', icon: '🗼' },
    { name: 'Tokyo', icon: '🗾' },
    { name: 'Dubai', icon: '🌇' }
  ];
  // Load last visited from localStorage on mount
  useEffect(() => {
    const savedLastVisited = localStorage.getItem('lastVisited');
    if (savedLastVisited) {
      setLastVisited(JSON.parse(savedLastVisited));
    }

    const savedLocation = localStorage.getItem('location');
    if (savedLocation) {
      setLocation(savedLocation);
    }
  }, []);

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch weather data when location changes
  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!location) return;
      
      setLoading(true);
      try {
        const response = await fetch(`https://wttr.in/${encodeURIComponent(location)}?format=j1`);
        if (!response.ok) {
          throw new Error('Weather data not available');
        }
        
        const data = await response.json();
        
        // Set current weather
        const current = data.current_condition[0];
        setWeather({
          location: location,
          temperature: parseInt(current.temp_C),
          feelsLike: parseInt(current.FeelsLikeC),
          condition: current.weatherDesc[0].value,
          humidity: current.humidity,
          windSpeed: current.windspeedKmph,
          visibility: current.visibility,
          pressure: current.pressure,
          uvIndex: current.uvIndex
        });

        // Set forecast
        const forecastData = data.weather.map(day => ({
          date: day.date,
          maxTemp: parseInt(day.maxtempC),
          minTemp: parseInt(day.mintempC),
          condition: day.hourly[4].weatherDesc[0].value,
          humidity: day.hourly[4].humidity,
          windSpeed: day.hourly[4].windspeedKmph,
          chanceOfRain: day.hourly[4].chanceofrain
        }));
        setForecast(forecastData);

        // Update last visited
        const newLastVisited = [location, ...lastVisited.filter(l => l !== location)].slice(0, 5);
        setLastVisited(newLastVisited);
        localStorage.setItem('lastVisited', JSON.stringify(newLastVisited));
        localStorage.setItem('location', location);

      } catch (error) {
        toast.error('Unable to fetch weather data. Please try again.');
        console.error('Weather fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setLocation(searchInput.trim());
      setSearchInput('');
      setIsSidebarOpen(false);
    }
  };

  const clearHistory = () => {
    setLastVisited([]);
    localStorage.removeItem('lastVisited');
  };

  const getWeatherIcon = (condition) => {
    const iconMap = {
      'Clear': '☀️',
      'Sunny': '☀️',
      'Partly cloudy': '⛅',
      'Cloudy': '☁️',
      'Overcast': '☁️',
      'Mist': '🌫️',
      'Fog': '🌫️',
      'Light rain': '🌦️',
      'Moderate rain': '🌧️',
      'Heavy rain': '⛈️',
      'Light snow': '🌨️',
      'Snow': '❄️',
      'Heavy snow': '🌨️',
      'Thunder': '⚡',
      'Thunderstorm': '⛈️'
    };
    return iconMap[condition] || '🌡️';
  };
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDay = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  return (
    <div
      className="relative min-h-screen text-white bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${currentTime.getHours() >= 6 && currentTime.getHours() < 18 ? day : night})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Mobile Menu Button - Keep your existing button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="relative md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white bg-opacity-10 backdrop-blur-md"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-16 6h16" />
        </svg>
      </button>

      <div className="relative flex flex-col md:flex-row min-h-screen">
       {/* Sidebar */}
              <div className={`
              fixed md:relative w-full md:w-1/4 h-fit bg-black bg-opacity-30 backdrop-blur-lg
              transform transition-transform duration-300 ease-in-out z-40
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
              md:translate-x-0
              `}>
              <div className="p-6 overflow-y-auto h-full">
                <div className="p-2 mb-5">
                <h1 className="text-4xl font-bold tracking-tight">GETweath</h1>
                </div>

                <form onSubmit={handleSearch} className="mb-8">
                <input
                  type="text"
                  className="w-full p-4 rounded-xl bg-white/10 backdrop-blur-md
                  border border-white/20 placeholder-gray-300
                  focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Search location..."
                  value={searchInput}
                  onChange={async (e) => {
                  setSearchInput(e.target.value);
                  if (e.target.value.length > 2) {
                    try {
                    const response = await fetch(
                      `https://api.geoapify.com/v1/geocode/autocomplete?text=${e.target.value}&apiKey=258670c807cd48d1b1954afc59b7ab7c`
                    );
                    const data = await response.json();
                    const suggestions = data.features.map(
                      feature => feature.properties.formatted
                    );
                    setSuggestions(suggestions);
                    } catch (error) {
                    console.error('Error fetching suggestions:', error);
                    }
                  } else {
                    setSuggestions([]);
                  }
                  }}
                />
                {suggestions.length > 0 && (
                  <div className="mt-2 bg-white/10 backdrop-blur-md rounded-lg">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        className="w-full p-3 text-left hover:bg-white/10 transition-colors duration-200"
                        onClick={() => {
                          setLocation(suggestion);
                          setSearchInput('');
                          setSuggestions([]);
                          setIsSidebarOpen(false);
                        }}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
                </form>
 {/* Popular Cities */}
 <div className="mb-8">
              <h4 className="text-xl font-semibold mb-4">Explore Places</h4>
              <ul className="space-y-3">
                {defaultCities.map((city) => (
                  <li
                    key={city.name}
                    onClick={() => {
                      setLocation(city.name);
                      setIsSidebarOpen(false);
                    }}
                    className="p-3 rounded-lg cursor-pointer hover:bg-white hover:bg-opacity-10 
                             transition-colors duration-200 flex items-center space-x-3"
                  >
                    <span className="text-2xl">{city.icon}</span>
                    <span>{city.name}</span>
                  </li>
                ))}
              </ul>
            </div>
                <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Recent Searches</h2>
                  {lastVisited.length > 0 && (
                  <button
                    onClick={clearHistory}
                    className="text-sm text-gray-400 hover:text-white"
                  >
                    Clear
                  </button>
                  )}
                </div>
                <div className="space-y-2">
                  {lastVisited.length > 0 ? (
                  lastVisited.slice(0, 4).map((city) => (
                    <button
                    key={city}
                    onClick={() => {
                      setLocation(city);
                      setIsSidebarOpen(false);
                      }}
                      className="w-full p-3 rounded-lg hover:bg-white/10
                           transition-colors duration-200 text-left"
                    >
                      {city}
                    </button>
                    ))
                  ) : (
                    <p className="text-gray-400 p-3">No recent searches</p>
                  )}
                  </div>
                </div>
                </div>
              </div>

              {/* Main Content */}
        <div className="flex-1 p-6 md:p-10">
        <div className="relative flex-1 p-4 md:p-10 overflow-y-auto">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-8 md:mb-16 mt-16 md:mt-0">
            <div className="mb-4 md:mb-0">
              <img src="https://cdn2.iconfinder.com/data/icons/weather-flat-14/64/weather02-512.png" alt="logo" className="w-12 md:w-16" />
              <p className="mt-0 pt-0 font-bold tracking-tight text-opacity-85 text-sm md:text-base">Dev by Mayank.DEv</p>
            </div>

            {/* Time and Date Display */}
            <div className="space-y-1 text-center md:text-right">
              <h1 className="text-4xl md:text-7xl font-extrabold mb-2 md:mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">
                {formatTime(currentTime)}
              </h1>
              <div className="flex-col space-y-1">
                <p className="text-xl md:text-3xl text-bold tracking-tight text-gray-300">{formatDate(currentTime)}</p>
                <p className="text-lg md:text-2xl text-bold text-gray-300">{formatDay(currentTime)}</p>
              </div>
            </div>
          </div>

            {loading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent" />
              </div>
            ) : weather ? (
              <div className="space-y-8">
                {/* Current Weather */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                      <h1 className="text-4xl font-bold mb-2">{weather.location}</h1>
                      <p className="text-xl text-gray-300 flex items-center gap-2">
                        <span>{getWeatherIcon(weather.condition)}</span>
                        {weather.condition}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-7xl font-bold">{weather.temperature}°</div>
                      <p className="text-gray-300">Feels like {weather.feelsLike}°</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                    <div className="text-center">
                      <p className="text-gray-300">Humidity</p>
                      <p className="text-2xl font-semibold">{weather.humidity}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-300">Wind Speed</p>
                      <p className="text-2xl font-semibold">{weather.windSpeed} km/h</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-300">Visibility</p>
                      <p className="text-2xl font-semibold">{weather.visibility} km</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-300">UV Index</p>
                      <p className="text-2xl font-semibold">{weather.uvIndex}</p>
                    </div>
                  </div>
                </div>

                {/* Forecast */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">3-Day Forecast</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {forecast.map((day, index) => (
                      <div
                        key={index}
                        className="bg-white/10 backdrop-blur-md rounded-xl p-6"
                      >
                        <p className="font-semibold mb-4">{day.date}</p>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-4xl">
                            {getWeatherIcon(day.condition)}
                          </span>
                          <div className="text-right">
                            <p className="text-3xl font-bold">{day.maxTemp}°</p>
                            <p className="text-gray-300">{day.minTemp}°</p>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm text-gray-300">
                          <p>Humidity: {day.humidity}%</p>
                          <p>Wind: {day.windSpeed} km/h</p>
                          <p>Chance of Rain: {day.chanceOfRain}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 mt-20">
                <p className="text-xl">Enter a location to get weather information</p>
              </div>
            )}
          </div>
          <footer className="text-center md:text-right text-xs mt-8 md:absolute md:bottom-0 md:right-0 md:mb-4 md:mr-4">
            &copy; 2024 All Rights Reserved | Developed By Mayank with ❤️
          </footer>
        </div>
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default App;