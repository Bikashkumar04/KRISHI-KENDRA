import React from 'react';
import { WeatherData } from '../services/weatherService.ts';
import './TodayDetails.css';

interface TodayDetailsProps {
  data: WeatherData;
}

const TodayDetails: React.FC<TodayDetailsProps> = ({ data }) => {
  // Convert wind speed from m/s to km/h
  const windSpeedKmh = Math.round(data.wind.speed * 3.6);

  // Convert visibility from meters to km
  const visibilityKm = (data.visibility / 1000).toFixed(1);

  return (
    <div className="today-details">
      <h3>Today's Details</h3>

      <div className="details-grid">
        {/* Humidity - Critical for pest control and disease prevention */}
        <div className="detail-card humidity">
          <div className="detail-icon">💧</div>
          <div className="detail-content">
            <div className="detail-label">Humidity</div>
            <div className="detail-value">{data.main.humidity}%</div>
            <div className="detail-help">
              {data.main.humidity > 80
                ? '⚠️ High fungal disease risk'
                : data.main.humidity > 60
                ? '✓ Normal'
                : '✓ Good'}
            </div>
          </div>
        </div>

        {/* Wind Speed - Important for pesticide spraying */}
        <div className="detail-card wind">
          <div className="detail-icon">💨</div>
          <div className="detail-content">
            <div className="detail-label">Wind Speed</div>
            <div className="detail-value">{windSpeedKmh} km/h</div>
            <div className="detail-help">
              {windSpeedKmh > 20
                ? '⚠️ Do not spray'
                : '✓ Safe to spray'}
            </div>
          </div>
        </div>

        {/* Pressure - Helps predict weather changes */}
        <div className="detail-card pressure">
          <div className="detail-icon">🎯</div>
          <div className="detail-content">
            <div className="detail-label">Pressure</div>
            <div className="detail-value">{data.main.pressure} mb</div>
            <div className="detail-help">
              {data.main.pressure < 1010
                ? '⚠️ Rain expected'
                : '✓ Stable'}
            </div>
          </div>
        </div>

        {/* Visibility - Important for work planning */}
        <div className="detail-card visibility">
          <div className="detail-icon">👁️</div>
          <div className="detail-content">
            <div className="detail-label">Visibility</div>
            <div className="detail-value">{visibilityKm} km</div>
            <div className="detail-help">
              {parseFloat(visibilityKm) < 5
                ? '⚠️ Low'
                : '✓ Good'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodayDetails;
