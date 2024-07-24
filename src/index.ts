import express, { Response, Request } from 'express';
import axios from 'axios';
import { transformData } from '../src/util/index';

const port: number = 3000;
const app = express();

const externalApiUrl = 'https://rest-test-eight.vercel.app/api/test';

// const cleanFileStructure = (structure: FileStructure): FileStructure => {
//   for (const key in structure) {
//     if (Array.isArray(structure[key])) {
//       // Remove empty strings
//       structure[key] = structure[key].filter((item) => item !== '');

//       // Recursively clean nested objects
//       structure[key] = structure[key]
//         .map((item) =>
//           typeof item === 'object'
//             ? cleanFileStructure(item as FileStructure)
//             : item
//         )
//         .filter((item) =>
//           typeof item === 'object'
//             ? Object.keys(item as FileStructure).length > 0
//             : true
//         );

//       // Remove empty arrays
//       if (structure[key].length === 0) {
//         delete structure[key];
//       }
//     }
//   }
//   return structure;
// };

// const transformData = (data: { fileUrl: string }[]): FileStructure => {
//   const fileStructure: FileStructure = {};

//   data.forEach((item) => {
//     const url = item.fileUrl;

//     if (typeof url !== 'string') {
//       console.error('Invalid URL:', url);
//       return;
//     }

//     const urlParts = url.split('/');
//     const ipWithPort = urlParts[2];
//     const ip = ipWithPort.split(':')[0];
//     const pathParts = urlParts.slice(3);

//     if (!fileStructure[ip]) {
//       fileStructure[ip] = [];
//     }

//     let currentLevel = fileStructure[ip];

//     pathParts.forEach((part, index) => {
//       if (index === pathParts.length - 1) {
//         currentLevel.push(part);
//       } else {
//         let nextLevel = currentLevel.find(
//           (item) => typeof item === 'object' && item[part]
//         );
//         if (!nextLevel) {
//           nextLevel = { [part]: [] };
//           currentLevel.push(nextLevel);
//         }
//         currentLevel = nextLevel[part];
//       }
//     });
//   });

//   return cleanFileStructure(fileStructure);
// };

// interface FileStructure {
//   [ip: string]: any[];
// }

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
