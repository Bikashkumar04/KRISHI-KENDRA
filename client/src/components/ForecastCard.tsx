import React from 'react';
import { ForecastData } from '../services/weatherService.ts';
import './ForecastCard.css';

interface ForecastCardProps {
  data: ForecastData;
}

const ForecastCard: React.FC<ForecastCardProps> = ({ data }) => {
  // Group forecast by day (take one entry per day at noon)
  const dailyForecasts = data.list
    .filter((item, index) => index % 8 === 0) // Every 8 entries = ~24 hours
    .slice(0, 5); // Get 5 days

  const getWeatherIcon = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const getHindiDay = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  };

  const getDateStr = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="forecast-section">
      <h3>5-Day Forecast</h3>
      <p className="forecast-help">
        🗓️ Plan your crop activities based on the next 5 days weather forecast
      </p>

      <div className="forecast-grid">
        {dailyForecasts.map((forecast, index) => (
          <div key={index} className="forecast-card">
            <div className="forecast-day">
              <div className="day-name">{getHindiDay(forecast.dt)}</div>
              <div className="day-date">{getDateStr(forecast.dt)}</div>
            </div>

            <img
              src={getWeatherIcon(forecast.weather[0].icon)}
              alt={forecast.weather[0].main}
              className="forecast-icon"
            />

            <div className="forecast-temp">
              <div className="temp-max">{Math.round(forecast.main.temp_max)}°C</div>
              <div className="temp-min">{Math.round(forecast.main.temp_min)}°C</div>
            </div>

            {/* Rain probability - Critical for farmers */}
            <div className="rain-chance">
              <div className="rain-label">Rain</div>
              <div className={`rain-value ${forecast.pop > 0.6 ? 'high' : ''}`}>
                {Math.round(forecast.pop * 100)}%
              </div>
            </div>

            {/* Farming recommendation */}
            <div className="forecast-advice">
              {forecast.pop > 0.7 && '🌧️ Skip irrigation'}
              {forecast.pop <= 0.7 && forecast.pop > 0.3 && '⚠️ Monitor conditions'}
              {forecast.pop <= 0.3 && '🌞 Irrigate'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForecastCard;
