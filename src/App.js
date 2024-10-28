import React, { useState, useEffect } from 'react';
import { fetchWeatherData } from './utils/weatherService';
import { getStoredData, setStoredData } from './utils/localStorageService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import day from './lib/day.jpg';
import night from './lib/night.jpg';

const WeatherApp = () => {
  const [weather, setWeather] = useState();
  const [location, setLocation] = useState(getStoredData('location') || '');
  const [lastVisited, setLastVisited] = useState(
    JSON.parse(getStoredData('lastVisited') || '[]')
  );
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchInput, setSearchInput] = useState('');

  const defaultCities = [
    { name: 'New York', icon: '🗽' },
    { name: 'California', icon: '🌴' },
    { name: 'Paris', icon: '🗼' },
    { name: 'Tokyo', icon: '🗾' },
    { name: 'Bali', icon: '🏖️' },
    { name: 'Sydney', icon: '🦘' },
    { name: 'Dubai', icon: '🌇' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadWeather = async () => {
      if (location) {
        setLoading(true);
        try {
          const weatherData = await fetchWeatherData(location);
          if (weatherData) {
            setWeather(weatherData);
            setStoredData('location', location);

            const newLastVisited = [location, ...lastVisited.filter(l => l !== location)].slice(0, 5);
            setLastVisited(newLastVisited);
            setStoredData('lastVisited', JSON.stringify(newLastVisited));
          }
        } catch (error) {
          toast.error('Unable to fetch weather data. Please try again.');
          console.error('Weather fetch error:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadWeather();
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setLocation(searchInput.trim());
      setSearchInput('');
    }
  };

  const clearHistory = () => {
    setLastVisited([]);
    setStoredData('lastVisited', '[]');
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

  const WeatherIcon = ({ condition }) => {
    const iconMap = {
      'Clear': '☀️',
      'Sunny': '☀️',
      'Partly cloudy': '⛅',
      'Cloudy': '☁️',
      'Overcast': '☁️',
      'Rain': '🌧️',
      'Light rain': '🌦️',
      'Heavy rain': '⛈️',
      'Snow': '🌨️',
      'Thunder': '⛈️',
      'Mist': '🌫️',
      'Fog': '🌫️'
    };

    return <span className="text-4xl">{iconMap[condition] || '🌡️'}</span>;
  };

  return (
    <div
      className="relative h-screen text-white bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${currentTime.getHours() >= 6 && currentTime.getHours() < 18 ? day : night})` }}
    >
      {/* Overlay for dimming effect */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="relative flex h-screen">
        {/* Sidebar with scrolling */}
        <div className="w-1/4 p-6 bg-black bg-opacity-30 backdrop-blur-lg  border-opacity-10 overflow-y-scroll">
        <div className='p-2 mb-5'>
        <h className=' text-4xl font-bold tracking-tight '> GETweath</h>

        </div>
                  <form onSubmit={handleSearch} className="relative mb-8">
            <input
              type="text"
              className="w-full p-4 rounded-xl bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 
                         placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Search location..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </form>

          {/* Popular Cities */}
          <div className="mb-8">
            <h4 className="text-xl font-semibold mb-4">Explore Places</h4>
            <ul className="space-y-3">
              {defaultCities.map((city) => (
                <li
                  key={city.name}
                  onClick={() => setLocation(city.name)}
                  className="p-3 rounded-lg cursor-pointer hover:bg-white hover:bg-opacity-10 
                             transition-colors duration-200 flex items-center space-x-3"
                >
                  <span className="text-2xl">{city.icon}</span>
                  <span>{city.name}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recent Searches */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-semibold">Last Visited</h4>
              {lastVisited.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="text-sm text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Clear
                </button>
              )}
            </div>
            <ul className="space-y-2">
              {lastVisited.length > 0 ? (
                lastVisited.map((city) => (
                  <li
                    key={city}
                    onClick={() => setLocation(city)}
                    className="p-3 rounded-lg cursor-pointer hover:bg-white hover:bg-opacity-10 
                               transition-colors duration-200 flex items-center space-x-2"
                  >
                    <span>{city}</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-400 p-3">No recent searches</li>
              )}
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative flex-1 p-10 overflow-y-auto">
          <div className="flex justify-between items-start mb-16">

            <div>
              <img src="https://cdn2.iconfinder.com/data/icons/weather-flat-14/64/weather02-512.png" alt="logo" width={60} />
              <p className="mt-0 pt-0 font-bold tracking-tight text-opacity-85">Dev by Mayank.DEv</p>
            </div>

            <div className="space-y-1">
              <h1 className="text-7xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">
                {formatTime(currentTime)}
              </h1>
              <div className="flex-col text-right space-y-1">
                <p className="text-3xl text-bold tracking-tight text-gray-300">{formatDate(currentTime)}</p>
                <p className="text-2xl text-bold text-gray-300">{formatDay(currentTime)}</p>
              </div>
            </div>
          </div>
          <div className=' flex-row mb-0 pt-20'>
            {weather && !loading && (
              <div className="text-right space-y-2 pr-5">
                <div className="flex items-right mr-0 pr-0 justify-end space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 2c3.866 0 7 3.134 7 7 0 5.25-7 13-7 13s-7-7.75-7-13c0-3.866 3.134-7 7-7zm0 3a4 4 0 100 8 4 4 0 000-8z"
                    />
                  </svg>
                  <p className="text-5xl font-extrabold tracking-tight text-gray-300">{weather.location}</p>
                </div>

                <div className="flex items-center justify-end space-x-4">
                  <WeatherIcon condition={weather.condition} />
                  <div>
                    <h2 className="text-6xl font-semibold tracking-tight  text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">
                      {weather.temperature}°C/
                    </h2>
                    <p className="text-6xl font-semibold tracking-tight  text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">
                      {(weather.temperature * 9 / 5 + 32).toFixed(1)}°F
                    </p>
                  </div>
                </div>
                <p className="text-3xl font-extrabold tracking-tight text-gray-300">{weather.condition}</p>
              </div>
            )}
            {loading && (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-400 border-t-transparent" />
              </div>
            )}
          </div>
          <footer className='absolute text-xs bottom-0 right-0 mb-4 mr-4'>
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

export default WeatherApp;
