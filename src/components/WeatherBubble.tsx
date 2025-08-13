import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer } from "lucide-react";
import { WeatherService } from "@/services/weatherService";

interface WeatherData {
  location: string;
  temperature: number;
  description: string;
  humidity: number;
  pressure: number;
  windSpeed: number;
  cloudiness: number;
  visibility: number;
  uvIndex: number;
  precipitation?: number;
}

interface WeatherBubbleProps {
  weatherService: WeatherService | null;
  location: string;
}

const WeatherBubble = ({ weatherService, location }: WeatherBubbleProps) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!weatherService || !location) return;
      
      setLoading(true);
      try {
        const data = await weatherService.getCurrentWeather(location);
        setWeather(data);
      } catch (error) {
        console.error('Failed to fetch weather:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [weatherService, location]);

  const getWeatherIcon = (description: string, cloudiness: number) => {
    const desc = description.toLowerCase();
    if (desc.includes('rain') || desc.includes('shower')) return CloudRain;
    if (desc.includes('cloud') || cloudiness > 50) return Cloud;
    return Sun;
  };

  const getWeatherGradient = (description: string) => {
    const desc = description.toLowerCase();
    if (desc.includes('rain')) return "bg-gradient-to-br from-blue-400 to-blue-600";
    if (desc.includes('cloud')) return "bg-gradient-to-br from-gray-400 to-gray-600";
    return "bg-[var(--gradient-weather)]";
  };

  if (loading) {
    return (
      <Card className="border border-primary/20 shadow-md">
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            <Cloud className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-sm text-muted-foreground">Loading weather...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!weather) {
    return (
      <Card className="border border-muted/50">
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            <Cloud className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Weather unavailable</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const WeatherIcon = getWeatherIcon(weather.description, weather.cloudiness);

  return (
    <Card className={`border border-primary/30 shadow-md overflow-hidden ${getWeatherGradient(weather.description)} text-white`}>
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <WeatherIcon className="h-4 w-4" />
            <span className="text-sm font-medium">Weather</span>
          </div>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
            {weather.location.split(',')[0]}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Thermometer className="h-3 w-3" />
              <span className="text-lg font-bold">{weather.temperature}°C</span>
            </div>
            <span className="text-xs opacity-90 capitalize">{weather.description}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <Droplets className="h-3 w-3" />
              <span>{weather.humidity}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Wind className="h-3 w-3" />
              <span>{weather.windSpeed}m/s</span>
            </div>
          </div>
          
          {weather.precipitation && weather.precipitation > 0 && (
            <div className="text-xs bg-white/10 rounded px-2 py-1">
              <CloudRain className="h-3 w-3 inline mr-1" />
              {weather.precipitation}mm
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherBubble;