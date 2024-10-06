import 'dotenv/config';
import { writeFileSync } from 'fs';
import axios from 'axios';

updateApiDoc();

async function updateApiDoc() {
  console.log('🔄 Retreiving AeroDB API documentation...');

  axios
    .get('https://api.aerodb.net/api.json')
    .then((response) => {
      const data = response.data;

      try {
        writeFileSync('src/types/openapi.json', JSON.stringify(data, null, 2));
      } catch (error) {
        console.error("Couldn't write API documentation to file.");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
