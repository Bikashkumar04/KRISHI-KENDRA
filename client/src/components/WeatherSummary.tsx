import React from 'react';
import { WeatherData } from '../services/weatherService.ts';
import './WeatherSummary.css';

interface WeatherSummaryProps {
  data: WeatherData;
}

const WeatherSummary: React.FC<WeatherSummaryProps> = ({ data }) => {
  // Get weather icon from OpenWeatherMap
  const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
  
  // Calculate rain probability (0-100%)
  // Important for farmers: High rain chance means delay irrigation
  const rainChance = data.rain ? Math.min(100, data.rain['1h'] * 20) : 0;

  return (
    <div className="weather-summary">
      <div className="summary-header">
        <h2 className="location">{data.name}, {data.sys.country}</h2>
        <p className="update-time">Now</p>
      </div>

      <div className="summary-content">
        <div className="temperature-section">
          <img src={iconUrl} alt={data.weather[0].main} className="weather-icon" />
          <div className="temp-info">
            <div className="current-temp">{Math.round(data.main.temp)}°C</div>
            <div className="weather-condition">{data.weather[0].main}</div>
            <div className="feels-like">Feels like: {Math.round(data.main.feels_like)}°C</div>
          </div>
        </div>

        {/* Rain probability - Critical for farmers */}
        <div className="rain-alert">
          <div className="rain-label">Rain Chance</div>
          <div className="rain-probability">
            <div className="rain-bar">
              <div 
                className="rain-fill" 
                style={{ width: `${rainChance}%` }}
              ></div>
            </div>
            <div className="rain-percent">{Math.round(rainChance)}%</div>
          </div>
          {rainChance > 60 && (
            <div className="rain-warning">⚠️ Skip irrigation</div>
          )}
        </div>
      </div>

      <div className="summary-footer">
        <div className="min-max">
            <span>Min: {Math.round(data.main.temp_min)}°C</span>
          <span>Max: {Math.round(data.main.temp_max)}°C</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherSummary;
