import { useQuery } from '@tanstack/react-query';
import { fetchWeatherData, getWeatherIcon, getWorkConditionColor } from '@/lib/weather-api';
import { useState, useEffect } from 'react';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  const { data: weather } = useQuery({
    queryKey: ['/api/weather'],
    refetchInterval: 600000, // Refetch every 10 minutes
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const workConditionColors = weather ? getWorkConditionColor(weather.workCondition) : 'text-gray-400 bg-gray-400';
  const [textColor, bgColor] = workConditionColors.split(' ');

  return (
    <header className="bg-gray-800 border-b border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button className="md:hidden mr-3 text-gray-400 hover:text-white">
            <i className="fas fa-bars text-xl"></i>
          </button>
          <h2 className="text-xl font-semibold text-white">{title}</h2>
        </div>
        
        {/* Weather & Time Info */}
        <div className="flex items-center space-x-4">
          {weather && (
            <div className={cn(
              "flex items-center space-x-2 px-3 py-1 rounded-lg bg-opacity-20",
              bgColor
            )}>
              <i className={cn(getWeatherIcon(weather.condition), textColor)}></i>
              <span className={cn("text-sm font-medium", textColor)}>
                {weather.workCondition === 'good' ? 'Good Conditions' :
                 weather.workCondition === 'caution' ? 'Use Caution' : 'Unsafe Conditions'}
              </span>
              <span className="text-sm text-gray-300">{Math.round(weather.temperature)}°F</span>
            </div>
          )}
          <div className="text-sm text-gray-300">
            <i className="fas fa-clock mr-1"></i>
            {formatTime(currentTime)}
          </div>
          <button className="text-gray-400 hover:text-white">
            <i className="fas fa-bell text-xl"></i>
          </button>
        </div>
      </div>
    </header>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
