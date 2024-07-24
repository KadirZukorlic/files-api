import express, { Response, Request } from 'express';
import axios from 'axios';
import { transformData } from '../src/util/index';
import NodeCache from 'node-cache';

const port: number = 3000;
const app = express();

const externalApiUrl = 'https://rest-test-eight.vercel.app/api/test';
const cache = new NodeCache({ stdTTL: 3600 });

const CACHE_KEY = 'transformedData';

const fetchDataAndCache = async () => {
  try {
    const response = await axios.get(externalApiUrl);
    const transformedData = transformData(response.data.items);
    cache.set(CACHE_KEY, transformedData);
    console.log('Data fetched and cached');
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const initializeServer = async () => {
  await fetchDataAndCache();

  app.get('/api/files', (req: Request, res: Response) => {
    try {
      const cachedData = cache.get(CACHE_KEY);
      if (cachedData) {
        return res.json(cachedData);
      } else {
        fetchDataAndCache().then(() => {
          const newData = cache.get(CACHE_KEY);
          return res.json(newData);
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch or process data' });
    }
  });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

initializeServer();
