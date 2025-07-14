import { WeatherData } from "@/types";

export async function fetchWeatherData(location: string = "default"): Promise<WeatherData> {
  const response = await fetch(`/api/weather?location=${location}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }
  
  return response.json();
}

export function getWeatherIcon(condition: string): string {
  switch (condition.toLowerCase()) {
    case 'clear':
      return 'fas fa-sun';
    case 'clouds':
      return 'fas fa-cloud';
    case 'rain':
      return 'fas fa-cloud-rain';
    case 'snow':
      return 'fas fa-snowflake';
    case 'thunderstorm':
      return 'fas fa-bolt';
    default:
      return 'fas fa-cloud-sun';
  }
}

export function getWorkConditionColor(condition: string): string {
  switch (condition) {
    case 'good':
      return 'text-green-400 bg-green-400';
    case 'caution':
      return 'text-yellow-400 bg-yellow-400';
    case 'unsafe':
      return 'text-red-400 bg-red-400';
    default:
      return 'text-gray-400 bg-gray-400';
  }
}

export function getOptimalWorkHours(weatherData: WeatherData): string {
  // Simple algorithm for optimal work time based on weather
  const temp = weatherData.temperature;
  const wind = weatherData.windSpeed;
  const precipitation = weatherData.precipitation;
  
  if (precipitation > 0.1 || wind > 20) {
    return "Work not recommended";
  }
  
  if (temp < 32 || temp > 90) {
    return "Limited work hours: 10:00 AM - 2:00 PM";
  }
  
  if (wind > 15 || temp < 40 || temp > 85) {
    return "Optimal work time: 9:00 AM - 4:00 PM";
  }
  
  return "Optimal work time: 8:00 AM - 6:00 PM";
}
