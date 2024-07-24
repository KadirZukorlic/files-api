import express, { Response, Request } from 'express';
import axios from 'axios';
import { transformData } from '../src/util/index';

const port: number = 3000;
const app = express();

const externalApiUrl = 'https://rest-test-eight.vercel.app/api/test';

app.get('/api/files', async (req: Request, res: Response) => {
  try {
    const response = await axios.get(externalApiUrl);

    const transformedData = transformData(response.data.items);

    res.json(transformedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch or process data' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
