import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cloud, Sun, CloudRain, Wind, Droplets, Eye, Thermometer } from "lucide-react";
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

interface WeatherWidgetProps {
  weatherService: WeatherService | null;
  location: string;
}

const WeatherWidget = ({ weatherService, location }: WeatherWidgetProps) => {
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
    if (desc.includes('rain')) return "bg-gradient-to-br from-slate-400 to-slate-600";
    if (desc.includes('cloud')) return "bg-gradient-to-br from-gray-300 to-gray-500";
    return "bg-[var(--gradient-weather)]";
  };

  if (loading) {
    return (
      <Card className="border-2 border-primary/20 shadow-[var(--shadow-medium)]">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-primary">
            <Cloud className="h-5 w-5" />
            Loading Weather...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!weather) {
    return (
      <Card className="border-2 border-muted/50">
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">
            Weather data unavailable. Please check your location and API key.
          </p>
        </CardContent>
      </Card>
    );
  }

  const WeatherIcon = getWeatherIcon(weather.description, weather.cloudiness);

  return (
    <Card className={`border-2 border-primary/30 shadow-[var(--shadow-strong)] ${getWeatherGradient(weather.description)} text-white overflow-hidden relative`}>
      <div className="absolute inset-0 bg-black/20"></div>
      <CardHeader className="pb-3 relative z-10">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WeatherIcon className="h-6 w-6" />
            <span className="text-lg font-bold">Current Weather</span>
          </div>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            {weather.location}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <Thermometer className="h-4 w-4" />
            <div>
              <p className="font-bold text-2xl">{weather.temperature}°C</p>
              <p className="text-sm opacity-90 capitalize">{weather.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4" />
            <div>
              <p className="font-semibold">{weather.humidity}%</p>
              <p className="text-xs opacity-80">Humidity</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4" />
            <div>
              <p className="font-semibold">{weather.windSpeed} m/s</p>
              <p className="text-xs opacity-80">Wind Speed</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <div>
              <p className="font-semibold">{weather.visibility} km</p>
              <p className="text-xs opacity-80">Visibility</p>
            </div>
          </div>
        </div>
        
        {weather.precipitation && weather.precipitation > 0 && (
          <div className="mt-4 p-3 bg-white/10 rounded-lg">
            <p className="text-sm">
              <CloudRain className="h-4 w-4 inline mr-1" />
              Precipitation: {weather.precipitation}mm
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;