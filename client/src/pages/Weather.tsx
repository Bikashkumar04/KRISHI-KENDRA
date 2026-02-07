import React, { useState, useEffect } from 'react';
import WeatherSummary from '../components/WeatherSummary.tsx';
import TodayDetails from '../components/TodayDetails.tsx';
import ForecastCard from '../components/ForecastCard.tsx';
import { getCurrentWeather, getForecast, WeatherData, ForecastData, getCoordinatesByCity } from '../services/weatherService.ts';
import './Weather.css';

const Weather: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchCity, setSearchCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('Delhi');
  const [gpsLoading, setGpsLoading] = useState(false);

  const indianDistricts = [
    'Delhi',
    'Punjab',
    'Haryana',
    'Madhya Pradesh',
    'Karnataka',
    'Maharashtra',
    'Uttar Pradesh',
    'Gujarat',
    'Tamil Nadu',
    'Andhra Pradesh',
  ];

  const coordinates: { [key: string]: { lat: number; lon: number } } = {
    Delhi: { lat: 28.7041, lon: 77.1025 },
    Punjab: { lat: 31.5204, lon: 74.3587 },
    Haryana: { lat: 29.0588, lon: 77.0745 },
    'Madhya Pradesh': { lat: 22.9375, lon: 78.6553 },
    Karnataka: { lat: 15.3173, lon: 75.7139 },
    Maharashtra: { lat: 19.7515, lon: 75.7139 },
    'Uttar Pradesh': { lat: 27.1767, lon: 78.0081 },
    Gujarat: { lat: 23.0225, lon: 72.5714 },
    'Tamil Nadu': { lat: 11.1271, lon: 79.2804 },
    'Andhra Pradesh': { lat: 15.9129, lon: 78.4675 },
  };

  const fetchWeatherData = async (districtName: string) => {
    setLoading(true);
    setError(null);
    try {
      let coords = coordinates[districtName];
      
      // If city not in predefined list, try to fetch from API
      if (!coords) {
        const locationData = await getCoordinatesByCity(districtName);
        coords = { lat: locationData.lat, lon: locationData.lon };
      }

      const [weatherData, forecastData] = await Promise.all([
        getCurrentWeather(coords.lat, coords.lon),
        getForecast(coords.lat, coords.lon),
      ]);

      setWeather(weatherData);
      setForecast(forecastData);
      setSelectedDistrict(districtName);
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError('Failed to fetch weather data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData(selectedDistrict);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCity.trim()) {
      fetchWeatherData(searchCity);
      setSearchCity('');
    }
  };

  const handleGPS = () => {
    setGpsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            // Use geocoding API to get city name from coordinates
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            const cityName = data.address?.city || data.address?.town || data.address?.village || 'Unknown Location';
            // Fetch weather for the coordinates directly
            const weatherResponse = await getCurrentWeather(latitude, longitude);
            const forecastResponse = await getForecast(latitude, longitude);
            setWeather(weatherResponse);
            setForecast(forecastResponse);
            setSelectedDistrict(cityName);
            setError(null);
          } catch (err) {
            console.error('Error fetching GPS weather:', err);
            setError('Failed to get weather for your location. Please try again.');
          } finally {
            setGpsLoading(false);
          }
        },
        (err) => {
          console.error('Geolocation error:', err);
          setError('Unable to access your location. Please enable location services and try again.');
          setGpsLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
      setGpsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="weather-page">
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading weather information...</p>
          <p className="loading-subtitle">(Please wait)</p>
        </div>
      </div>
    );
  }

  if (error || !weather || !forecast) {
    return (
      <div className="weather-page">
        <div className="error-container">
          <div className="error-icon">📍</div>
          <h2>Sorry!</h2>
          <p>{error || 'Weather data is unavailable'}</p>
          <button onClick={() => fetchWeatherData(selectedDistrict)} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="weather-page">
      <div className="weather-header">
        <h1>🌤️ Farmer Weather Service</h1>
        <p>Accurate weather information for your farm</p>
      </div>

      <div className="district-selector">
        <div className="selector-header">
          <h3>Select Location</h3>
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Enter city or district..."
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              Search
            </button>
            <button type="button" onClick={handleGPS} className="gps-btn" disabled={gpsLoading}>
              {gpsLoading ? '📍 Getting Location...' : '📍 Use My Location'}
            </button>
          </form>
        </div>

        <div className="district-buttons">
          {indianDistricts.map((district) => (
            <button
              key={district}
              onClick={() => fetchWeatherData(district)}
              className={`district-btn ${selectedDistrict === district ? 'active' : ''}`}
            >
              {district}
            </button>
          ))}
        </div>
      </div>

      <div className="weather-content">
        <WeatherSummary data={weather} />
        <TodayDetails data={weather} />
        <ForecastCard data={forecast} />
      </div>

      <div className="farming-tips">
        <h3>💡 Farming Tips</h3>
        <div className="tips-content">
          <div className="tip">
            <strong>Irrigation Timing:</strong> Avoid irrigation 2-3 days before rainfall.
          </div>
          <div className="tip">
            <strong>Spraying:</strong> Apply pesticides/fertilizers when wind speed is 0-10 km/h.
          </div>
          <div className="tip">
            <strong>Soil Moisture:</strong> 60-80% moisture is ideal for most crops.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weather;
