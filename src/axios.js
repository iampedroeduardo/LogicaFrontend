import axios from "axios";

const instance = axios.create({
  baseURL: 'https://b045fca9b559.ngrok-free.app/api',
  headers: {'ngrok-skip-browser-warning': 'true'}
});

export default instance;
