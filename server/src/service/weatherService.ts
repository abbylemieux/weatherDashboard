import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  temperature: number;
  windSpeed: number;
  humidity: number;
  description: string;

  constructor(weatherData: any) {
    this.temperature = weatherData.temperature || weatherData.tempF || 0;
    this.windSpeed = weatherData.windSpeed || 0;
    this.humidity = weatherData.humidity || 0;
    this.description = weatherData.description || weatherData.iconDescription || '';
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string;
  private apiKey: string;
  private cityName: string;

  constructor() {
    this.baseURL = process.env.BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
    this.cityName = '';
  }

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    const response = await fetch(query);
    const data = await response.json();
    return data;
  }

  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const { lat, lon } = locationData;
    return { lat, lon };
  }

  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    return `${this.baseURL}/geocode/v1/json?q=${this.cityName}&key=${this.apiKey}`;
  }

  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const { lat, lon } = coordinates;
    return `${this.baseURL}/weather/1.0/report.json?product=observation&latitude=${lat}&longitude=${lon}`;
  }

  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    const query = this.buildGeocodeQuery();
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
  }

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const query = this.buildWeatherQuery(coordinates);
    const response = await fetch(query);
    const data = await response.json();
    return data;
  }

  // TODO: Build parseCurrentWeather method
    // private parseCurrentWeather(response: any) {
    //   const currentWeather = response.observations.location[0].observation[0];
    //   return new Weather(currentWeather);
    // }

  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const forecastArray = weatherData.map((weather) => {
      return new Weather(weather);
    });
    forecastArray.unshift(currentWeather);
    return forecastArray;
  }

  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const currentWeather = await this.fetchWeatherData(coordinates);
    const forecastData = await this.fetchWeatherData(coordinates);
    const forecastArray = this.buildForecastArray(currentWeather, forecastData);
    return forecastArray;
  }
}

export default new WeatherService();
