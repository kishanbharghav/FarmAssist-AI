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

interface WeatherForecast {
  date: string;
  temperature: {
    min: number;
    max: number;
  };
  description: string;
  humidity: number;
  precipitation: number;
  windSpeed: number;
}

interface CropPrice {
  crop: string;
  price: number;
  unit: string;
  currency: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  date: string;
}

export class WeatherService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getCurrentWeather(location: string): Promise<WeatherData> {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${this.apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();

      return {
        location: `${data.name}, ${data.sys.country}`,
        temperature: Math.round(data.main.temp),
        description: data.weather[0].description,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        windSpeed: data.wind?.speed || 0,
        cloudiness: data.clouds.all,
        visibility: data.visibility ? data.visibility / 1000 : 0, // Convert to km
        uvIndex: 0, // Would need UV endpoint
        precipitation: data.rain?.['1h'] || data.snow?.['1h'] || 0
      };
    } catch (error) {
      console.error('Error fetching weather:', error);
      throw new Error('Failed to fetch weather data');
    }
  }

  async getForecast(location: string): Promise<WeatherForecast[]> {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(location)}&appid=${this.apiKey}&units=metric&cnt=40`
      );

      if (!response.ok) {
        throw new Error(`Forecast API error: ${response.status}`);
      }

      const data = await response.json();

      // Group by day and get daily summaries
      const dailyForecasts: { [key: string]: any[] } = {};
      
      data.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000).toISOString().split('T')[0];
        if (!dailyForecasts[date]) {
          dailyForecasts[date] = [];
        }
        dailyForecasts[date].push(item);
      });

      return Object.entries(dailyForecasts).slice(0, 5).map(([date, forecasts]) => {
        const temps = forecasts.map(f => f.main.temp);
        const descriptions = forecasts.map(f => f.weather[0].description);
        const precipitation = forecasts.reduce((sum, f) => sum + (f.rain?.['3h'] || f.snow?.['3h'] || 0), 0);
        
        return {
          date,
          temperature: {
            min: Math.round(Math.min(...temps)),
            max: Math.round(Math.max(...temps))
          },
          description: descriptions[Math.floor(descriptions.length / 2)], // Middle description
          humidity: Math.round(forecasts.reduce((sum, f) => sum + f.main.humidity, 0) / forecasts.length),
          precipitation: Math.round(precipitation * 10) / 10,
          windSpeed: Math.round(forecasts.reduce((sum, f) => sum + (f.wind?.speed || 0), 0) / forecasts.length * 10) / 10
        };
      });
    } catch (error) {
      console.error('Error fetching forecast:', error);
      throw new Error('Failed to fetch forecast data');
    }
  }
}

// Mock crop prices - in a real app, this would be from an agricultural API
export const getCropPrices = (): CropPrice[] => {
  const baseDate = new Date().toISOString().split('T')[0];
  
  return [
    {
      crop: 'Wheat',
      price: 20350,
      unit: 'per ton',
      currency: 'INR',
      trend: 'up',
      change: 2.3,
      date: baseDate
    },
    {
      crop: 'Corn',
      price: 18750,
      unit: 'per ton',
      currency: 'INR',
      trend: 'down',
      change: -1.2,
      date: baseDate
    },
    {
      crop: 'Soybeans',
      price: 42500,
      unit: 'per ton',
      currency: 'INR',
      trend: 'up',
      change: 5.8,
      date: baseDate
    },
    {
      crop: 'Rice (Basmati)',
      price: 45000,
      unit: 'per ton',
      currency: 'INR',
      trend: 'stable',
      change: 0.5,
      date: baseDate
    },
    {
      crop: 'Tomatoes',
      price: 25000,
      unit: 'per ton',
      currency: 'INR',
      trend: 'up',
      change: 12.5,
      date: baseDate
    },
    {
      crop: 'Potatoes',
      price: 18000,
      unit: 'per ton',
      currency: 'INR',
      trend: 'down',
      change: -3.2,
      date: baseDate
    },
    {
      crop: 'Cotton',
      price: 62000,
      unit: 'per ton',
      currency: 'INR',
      trend: 'up',
      change: 3.5,
      date: baseDate
    },
    {
      crop: 'Sugarcane',
      price: 3200,
      unit: 'per ton',
      currency: 'INR',
      trend: 'stable',
      change: 0.5,
      date: baseDate
    },
    {
      crop: 'Onions',
      price: 15000,
      unit: 'per ton',
      currency: 'INR',
      trend: 'down',
      change: -8.2,
      date: baseDate
    },
    {
      crop: 'Turmeric',
      price: 95000,
      unit: 'per ton',
      currency: 'INR',
      trend: 'up',
      change: 4.8,
      date: baseDate
    },
    {
      crop: 'Chickpeas',
      price: 55000,
      unit: 'per ton',
      currency: 'INR',
      trend: 'up',
      change: 6.2,
      date: baseDate
    }
  ];
};