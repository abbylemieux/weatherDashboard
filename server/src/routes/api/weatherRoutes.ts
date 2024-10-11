import { Router, Request, Response } from 'express';
const router = Router();
export default router;

import { HistoryService } from '..//service/historyService'; 
import { WeatherService } from '../service/weatherService'; 

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
 
  // TODO: GET weather data from city name
  try {
    const city = req.body.city;
    const weatherService = new WeatherService();
    const historyService = new HistoryService();

    weatherService.cityName = city;

    const coordinates = await weatherService.fetchAndDestructureLocationData();
    const weatherData = await weatherService.fetchWeatherData(coordinates);

  // TODO: save city to search history
  await historyService.addCity(city);

  res.json(weatherData);
} catch (error) {
  console.error(error);
  res.status(500).send('An error occurred while fetching weather data');
}
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const historyService = new HistoryService();
    const cities = await historyService.getCities();
    res.json(cities);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching the search history');
  }
});


// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    const historyService = new HistoryService();
    const id = req.params.id;

    await historyService.removeCity(id);
    res.json({ message: 'City removed from search history' });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while deleting the city from search history');
  }
});