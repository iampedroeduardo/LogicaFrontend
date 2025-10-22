import axios from "axios";

const instance = axios.create({
  baseURL: 'https://f43eda3f6f9b.ngrok-free.app/api',
  headers: {'ngrok-skip-browser-warning': 'true'}
});

export default instance;
