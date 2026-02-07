import './Home.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentWeather } from '../services/weatherService.ts';
import { WeatherData } from '../services/weatherService.ts';

interface WeatherInfo {
  temp: number;
  description: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  location: string;
  icon: string;
  latitude?: number;
  longitude?: number;
  timestamp?: number;
}

interface StoredLocation {
  latitude: number;
  longitude: number;
  city: string;
  timestamp: number;
}

function Home() {
  const navigate = useNavigate();
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<StoredLocation | null>(null);

  // Initialize weather data from GPS or localStorage
  useEffect(() => {
    const initializeWeather = async () => {
      try {
        setLoadingWeather(true);
        
        // Check localStorage for cached location
        const storedLocation = localStorage.getItem('userLocation');
        let latitude = 28.7041; // Default: New Delhi
        let longitude = 77.1025;
        let cityName = 'New Delhi';

        if (storedLocation) {
          try {
            const parsed = JSON.parse(storedLocation) as StoredLocation;
            latitude = parsed.latitude;
            longitude = parsed.longitude;
            cityName = parsed.city;
            setUserLocation(parsed);
            console.log('📍 Using cached location:', cityName);
          } catch (error) {
            console.error('Error parsing stored location:', error);
            localStorage.removeItem('userLocation');
          }
        }

        // Fetch weather for the location
        const data: WeatherData = await getCurrentWeather(latitude, longitude);
        if (data && data.main) {
          const weatherInfo: WeatherInfo = {
            temp: Math.round(data.main.temp),
            description: data.weather?.[0]?.main || 'N/A',
            humidity: data.main.humidity,
            windSpeed: Math.round(data.wind.speed * 3.6), // Convert to km/h
            feelsLike: Math.round(data.main.feels_like),
            location: data.name,
            icon: data.weather?.[0]?.icon || '01d',
            latitude: data.coord.lat,
            longitude: data.coord.lon,
            timestamp: Date.now(),
          };
          setWeather(weatherInfo);

          // Update localStorage with new weather data
          const locationData: StoredLocation = {
            latitude: data.coord.lat,
            longitude: data.coord.lon,
            city: data.name,
            timestamp: Date.now(),
          };
          localStorage.setItem('userLocation', JSON.stringify(locationData));
          setUserLocation(locationData);
        }
      } catch (error) {
        console.error('Error fetching weather:', error);
        // Try to use fresh default location
        try {
          const data: WeatherData = await getCurrentWeather(28.7041, 77.1025);
          if (data && data.main) {
            setWeather({
              temp: Math.round(data.main.temp),
              description: data.weather?.[0]?.main || 'N/A',
              humidity: data.main.humidity,
              windSpeed: Math.round(data.wind.speed * 3.6),
              feelsLike: Math.round(data.main.feels_like),
              location: data.name,
              icon: data.weather?.[0]?.icon || '01d',
              latitude: data.coord.lat,
              longitude: data.coord.lon,
              timestamp: Date.now(),
            });
          }
        } catch (fallbackError) {
          console.error('Fallback weather fetch failed:', fallbackError);
        }
      } finally {
        setLoadingWeather(false);
      }
    };

    initializeWeather();
  }, []);

  // Handle GPS location detection
  const handleGPSClick = async () => {
    setGpsLoading(true);
    setGpsError(null);

    if (!navigator.geolocation) {
      setGpsError('GPS not supported on this device');
      setGpsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          console.log('📍 GPS Location:', latitude, longitude);

          // Fetch weather for GPS location
          const data: WeatherData = await getCurrentWeather(latitude, longitude);
          if (data && data.main) {
            const weatherInfo: WeatherInfo = {
              temp: Math.round(data.main.temp),
              description: data.weather?.[0]?.main || 'N/A',
              humidity: data.main.humidity,
              windSpeed: Math.round(data.wind.speed * 3.6),
              feelsLike: Math.round(data.main.feels_like),
              location: data.name,
              icon: data.weather?.[0]?.icon || '01d',
              latitude: data.coord.lat,
              longitude: data.coord.lon,
              timestamp: Date.now(),
            };
            setWeather(weatherInfo);

            // Save location to localStorage
            const locationData: StoredLocation = {
              latitude: data.coord.lat,
              longitude: data.coord.lon,
              city: data.name,
              timestamp: Date.now(),
            };
            localStorage.setItem('userLocation', JSON.stringify(locationData));
            setUserLocation(locationData);
          }
        } catch (error) {
          console.error('Error fetching weather for GPS location:', error);
          setGpsError('Unable to fetch weather for your location');
        } finally {
          setGpsLoading(false);
        }
      },
      (error) => {
        console.error('GPS Error:', error);
        let errorMessage = 'Unable to get your location';
        
        if (error.code === 1) {
          errorMessage = 'Location permission denied. Please enable location access.';
        } else if (error.code === 2) {
          errorMessage = 'Location unavailable. Please try again.';
        } else if (error.code === 3) {
          errorMessage = 'Location request timed out. Please try again.';
        }
        
        setGpsError(errorMessage);
        setGpsLoading(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000, // Cache location for 5 minutes
      }
    );
  };

  // Handle clearing stored location
  const handleClearLocation = () => {
    localStorage.removeItem('userLocation');
    setUserLocation(null);
    // Reset to New Delhi
    const resetWeatherFetch = async () => {
      try {
        const data: WeatherData = await getCurrentWeather(28.7041, 77.1025);
        if (data && data.main) {
          setWeather({
            temp: Math.round(data.main.temp),
            description: data.weather?.[0]?.main || 'N/A',
            humidity: data.main.humidity,
            windSpeed: Math.round(data.wind.speed * 3.6),
            feelsLike: Math.round(data.main.feels_like),
            location: data.name,
            icon: data.weather?.[0]?.icon || '01d',
            latitude: data.coord.lat,
            longitude: data.coord.lon,
            timestamp: Date.now(),
          });
        }
      } catch (error) {
        console.error('Error resetting location:', error);
      }
    };
    resetWeatherFetch();
    setGpsError(null);
  };

  const getWeatherEmoji = (description: string) => {
    const desc = description.toLowerCase();
    if (desc.includes('sunny') || desc.includes('clear')) return '☀️';
    if (desc.includes('cloud')) return '☁️';
    if (desc.includes('rain')) return '🌧️';
    if (desc.includes('haze')) return '🌫️';
    if (desc.includes('thunder')) return '⛈️';
    if (desc.includes('storm')) return '🌩️';
    if (desc.includes('mist')) return '🌫️';
    if (desc.includes('wind')) return '💨';
    return '🌤️';
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">🌾 KRISHI KENDRA 🚜</h1>
          <p className="hero-subtitle">Empowering Farmers with Real-Time Market & Weather Information</p>
          <p className="hero-description">Your complete digital platform for agricultural success</p>
        </div>
      </section>

      {/* Weather Widget */}
      {!loadingWeather && weather && (
        <section className="weather-widget-section">
          <div className="section-header">
            <h2 className="section-title">Current Weather</h2>
            <div className="weather-actions">
              <button
                className="gps-button"
                onClick={handleGPSClick}
                disabled={gpsLoading}
                title="Detect your location using GPS"
              >
                {gpsLoading ? '⏳ Detecting...' : '📍 Use My Location'}
              </button>
              {userLocation && (
                <button
                  className="clear-location-button"
                  onClick={handleClearLocation}
                  title="Reset to default location"
                >
                  🔄 Reset
                </button>
              )}
            </div>
          </div>

          {gpsError && (
            <div className="error-message">
              ⚠️ {gpsError}
            </div>
          )}

          <div className="weather-widget">
            <div className="weather-main">
              <div className="weather-icon-large">
                {getWeatherEmoji(weather.description)}
              </div>
              <div className="weather-info">
                <div className="weather-temp">
                  <span className="temp-value">{weather.temp}°C</span>
                  <span className="temp-feel">Feels like {weather.feelsLike}°C</span>
                </div>
                <div className="weather-location">
                  {userLocation ? '📍' : '📌'} {weather.location}
                </div>
                {userLocation && (
                  <div className="location-info">
                    <small>Last updated: {new Date(userLocation.timestamp).toLocaleTimeString('en-IN')}</small>
                  </div>
                )}
                <div className="weather-condition">{weather.description}</div>
              </div>
            </div>
            <div className="weather-details">
              <div className="weather-detail-card">
                <span className="detail-label">💧 Humidity</span>
                <span className="detail-value">{weather.humidity}%</span>
              </div>
              <div className="weather-detail-card">
                <span className="detail-label">💨 Wind Speed</span>
                <span className="detail-value">{weather.windSpeed} km/h</span>
              </div>
            </div>
          </div>

          {userLocation && (
            <div className="storage-info">
              <small>📦 Location saved to device memory for quick access</small>
            </div>
          )}
        </section>
      )}

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">What We Offer</h2>
        <div className="features-grid">
          <div className="feature-card" onClick={() => navigate('/mandi-price')} style={{ cursor: 'pointer' }}>
            <div className="feature-icon">📊</div>
            <h3>Live Mandi Prices</h3>
            <p>Get real-time agricultural market prices from across India. Track commodity prices for better selling decisions.</p>
            <div className="feature-benefits">
              <span className="benefit">✓ 28+ States</span>
              <span className="benefit">✓ 60+ Commodities</span>
              <span className="benefit">✓ Live Updates</span>
            </div>
          </div>

          <div className="feature-card" onClick={() => navigate('/weather')} style={{ cursor: 'pointer' }}>
            <div className="feature-icon">🌦️</div>
            <h3>Weather Forecasts</h3>
            <p>Plan your farming activities with accurate 5-day weather forecasts including rainfall and wind predictions.</p>
            <div className="feature-benefits">
              <span className="benefit">✓ 5-Day Forecast</span>
              <span className="benefit">✓ GPS Location</span>
              <span className="benefit">✓ Farm Tips</span>
            </div>
          </div>

          <div className="feature-card" onClick={() => navigate('/weather')} style={{ cursor: 'pointer' }}>
            <div className="feature-icon">📍</div>
            <h3>Location-Based Info</h3>
            <p>Get customized information specific to your location or search any city for weather and market data.</p>
            <div className="feature-benefits">
              <span className="benefit">✓ GPS Enabled</span>
              <span className="benefit">✓ City Search</span>
              <span className="benefit">✓ Local Markets</span>
            </div>
          </div>

          <div className="feature-card" onClick={() => navigate('/weather')} style={{ cursor: 'pointer' }}>
            <div className="feature-icon">🌱</div>
            <h3>Farming Insights</h3>
            <p>Get expert recommendations on crop irrigation, spraying, and seasonal guidance based on weather conditions.</p>
            <div className="feature-benefits">
              <span className="benefit">✓ Smart Tips</span>
              <span className="benefit">✓ Seasonal Guide</span>
              <span className="benefit">✓ Best Practices</span>
            </div>
          </div>

          <div className="feature-card" onClick={() => navigate('/government-schemes')} style={{ cursor: 'pointer' }}>
            <div className="feature-icon">🏛️</div>
            <h3>Government Schemes</h3>
            <p>Discover and apply for agricultural subsidies, loans, and schemes from Central & State governments.</p>
            <div className="feature-benefits">
              <span className="benefit">✓ Central Schemes</span>
              <span className="benefit">✓ State Schemes</span>
              <span className="benefit">✓ Easy Apply</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="stats-section">
        <h2 className="section-title">Serving Indian Agriculture</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">28+</div>
            <div className="stat-label">States & UTs</div>
            <div className="stat-icon">🗺️</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">60+</div>
            <div className="stat-label">Commodities</div>
            <div className="stat-icon">🌾</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">100+</div>
            <div className="stat-label">Markets</div>
            <div className="stat-icon">🏪</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Live Updates</div>
            <div className="stat-icon">⚡</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Transform Your Farming?</h2>
        <p>Start checking market prices, weather forecasts, and government schemes today!</p>
        <div className="cta-buttons">
          <a href="/mandi-price" className="cta-button primary">
            📊 Check Mandi Prices
          </a>
          <a href="/weather" className="cta-button secondary">
            🌦️ View Weather Forecast
          </a>
          <a href="/government-schemes" className="cta-button primary">
            🏛️ Government Schemes
          </a>
        </div>
      </section>

      {/* Footer Info */}
      <section className="footer-info">
        <div className="info-grid">
          <div className="info-card">
            <h3>🌍 Government Data</h3>
            <p>Powered by official government agriculture APIs</p>
          </div>
          <div className="info-card">
            <h3>🔒 Secure & Reliable</h3>
            <p>Your data is safe with encrypted connections</p>
          </div>
          <div className="info-card">
            <h3>📱 Mobile Friendly</h3>
            <p>Access from any device, anywhere, anytime</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
