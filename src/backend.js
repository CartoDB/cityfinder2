import axios from 'axios';
import cartojs from '@carto/carto.js/dist/public/carto.js';

const API_KEY = 'default_public';
const USER_NAME = 'solutions';

export const mapboxgl = window.mapboxgl;

export const cartovl = window.carto;
cartovl.setDefaultAuth({
  user: USER_NAME,
  apiKey: API_KEY
});

export const sqlClient = axios.create({
  method: 'get',
  url: `https://${USER_NAME}.carto.com/api/v1/sql?`,
  params: {
    api_key: API_KEY
  }
});

export const cartojsClient = new cartojs.Client({
  apiKey: API_KEY,
  username: USER_NAME
});
