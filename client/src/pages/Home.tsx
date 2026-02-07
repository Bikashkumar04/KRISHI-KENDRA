import './Home.css';
import { useState, useEffect } from 'react';
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
}

function Home() {
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(true);

  useEffect(() => {
    // Fetch weather for default location (New Delhi)
    const fetchWeather = async () => {
      try {
        // Default location: New Delhi
        const data: WeatherData = await getCurrentWeather(28.7041, 77.1025);
        if (data && data.main) {
          setWeather({
            temp: Math.round(data.main.temp),
            description: data.weather?.[0]?.main || 'N/A',
            humidity: data.main.humidity,
            windSpeed: Math.round(data.wind.speed * 3.6), // Convert to km/h
            feelsLike: Math.round(data.main.feels_like),
            location: data.name,
            icon: data.weather?.[0]?.icon || '01d',
          });
        }
      } catch (error) {
        console.error('Error fetching weather:', error);
      } finally {
        setLoadingWeather(false);
      }
    };

    fetchWeather();
  }, []);

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
          <h2 className="section-title">Current Weather</h2>
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
                <div className="weather-location">{weather.location}</div>
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
        </section>
      )}

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">What We Offer</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Live Mandi Prices</h3>
            <p>Get real-time agricultural market prices from across India. Track commodity prices for better selling decisions.</p>
            <div className="feature-benefits">
              <span className="benefit">✓ 28+ States</span>
              <span className="benefit">✓ 60+ Commodities</span>
              <span className="benefit">✓ Live Updates</span>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🌦️</div>
            <h3>Weather Forecasts</h3>
            <p>Plan your farming activities with accurate 5-day weather forecasts including rainfall and wind predictions.</p>
            <div className="feature-benefits">
              <span className="benefit">✓ 5-Day Forecast</span>
              <span className="benefit">✓ GPS Location</span>
              <span className="benefit">✓ Farm Tips</span>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📍</div>
            <h3>Location-Based Info</h3>
            <p>Get customized information specific to your location or search any city for weather and market data.</p>
            <div className="feature-benefits">
              <span className="benefit">✓ GPS Enabled</span>
              <span className="benefit">✓ City Search</span>
              <span className="benefit">✓ Local Markets</span>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🌱</div>
            <h3>Farming Insights</h3>
            <p>Get expert recommendations on crop irrigation, spraying, and seasonal guidance based on weather conditions.</p>
            <div className="feature-benefits">
              <span className="benefit">✓ Smart Tips</span>
              <span className="benefit">✓ Seasonal Guide</span>
              <span className="benefit">✓ Best Practices</span>
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
        <p>Start checking market prices and weather forecasts today!</p>
        <div className="cta-buttons">
          <a href="/mandi-price" className="cta-button primary">
            📊 Check Mandi Prices
          </a>
          <a href="/weather" className="cta-button secondary">
            🌦️ View Weather Forecast
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
