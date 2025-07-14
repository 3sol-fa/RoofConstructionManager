import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WeatherData } from '@/types';
import { getWeatherIcon, getWorkConditionColor, getOptimalWorkHours } from '@/lib/weather-api';

export function WeatherWidget() {
  const { data: weather, isLoading } = useQuery<WeatherData>({
    queryKey: ['/api/weather'],
    refetchInterval: 600000, // Refetch every 10 minutes
  });

  if (isLoading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
            <div className="h-16 bg-gray-700 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!weather) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white">
            <i className="fas fa-cloud-sun mr-2 text-blue-400"></i>
            Weather Unavailable
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">Weather data could not be loaded.</p>
        </CardContent>
      </Card>
    );
  }

  const workConditionColors = getWorkConditionColor(weather.workCondition);
  const [textColor, bgColor] = workConditionColors.split(' ');

  // Mock forecast data for demonstration
  const forecast = [
    { time: 'Current', temp: weather.temperature, condition: weather.condition, workCondition: weather.workCondition },
    { time: '12:00 PM', temp: weather.temperature + 6, condition: 'Clouds', workCondition: 'caution' },
    { time: '4:00 PM', temp: weather.temperature - 7, condition: 'Rain', workCondition: 'unsafe' },
  ];

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white">
          <i className="fas fa-cloud-sun mr-2 text-blue-400"></i>
          Weather & Work Conditions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {forecast.map((item, index) => {
            const itemColors = getWorkConditionColor(item.workCondition);
            const [itemTextColor, itemBgColor] = itemColors.split(' ');
            
            return (
              <div key={index} className={`${itemBgColor} bg-opacity-10 border border-current rounded-lg p-4 ${itemTextColor}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">{item.time}</span>
                  <i className={getWeatherIcon(item.condition)}></i>
                </div>
                <p className="text-xl font-bold">{Math.round(item.temp)}°F</p>
                <p className="text-sm text-gray-300">{item.condition}</p>
              </div>
            );
          })}
        </div>
        
        {/* Work Time Recommendation */}
        <div className={`mt-4 p-3 ${bgColor} bg-opacity-10 border border-current rounded-lg ${textColor}`}>
          <p className="text-sm font-medium">
            <i className="fas fa-clock mr-2"></i>
            {getOptimalWorkHours(weather)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
