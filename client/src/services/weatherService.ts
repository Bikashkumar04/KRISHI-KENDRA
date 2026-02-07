// OpenWeatherMap API service
// This service helps farmers get accurate weather data for crop planning and irrigation

const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.openweathermap.org/data/2.5';

if (!API_KEY) {
  console.warn('OpenWeatherMap API key is missing');
}

// Existing code for interfaces and functions...

export interface WeatherData {
  coord: { lon: number; lat: number };
  weather: Array<{ id: number; main: string; description: string; icon: string }>;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: { speed: number; deg: number };
  clouds: { all: number };
  rain?: { '1h': number };
  sys: { country: string; sunrise: number; sunset: number };
  timezone: number;
  name: string;
}

export interface ForecastData {
  list: Array<{
    dt: number;
    main: { temp_min: number; temp_max: number; humidity: number };
    weather: Array<{ icon: string; main: string }>;
    wind: { speed: number };
    pop: number; // Probability of precipitation
    rain?: { '3h': number };
  }>;
  city: { name: string; country: string };
}

// Fetch current weather for a location
export const getCurrentWeather = async (
  lat: number,
  lon: number
): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    if (!response.ok) throw new Error('Weather data fetch failed');
    return await response.json();
  } catch (error) {
    console.error('Error fetching current weather:', error);
    throw error;
  }
};

// Fetch 5-day forecast
export const getForecast = async (
  lat: number,
  lon: number
): Promise<ForecastData> => {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    if (!response.ok) throw new Error('Forecast data fetch failed');
    return await response.json();
  } catch (error) {
    console.error('Error fetching forecast:', error);
    throw error;
  }
};

// Get location coordinates by city name (for Indian districts)
export const getCoordinatesByCity = async (
  cityName: string
): Promise<{ lat: number; lon: number; name: string }> => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?q=${cityName},IN&appid=${API_KEY}&units=metric`
    );
    if (!response.ok) throw new Error('Location not found');
    const data = await response.json();
    return {
      lat: data.coord.lat,
      lon: data.coord.lon,
      name: data.name,
    };
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    throw error;
  }
};
