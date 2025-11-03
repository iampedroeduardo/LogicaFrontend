import axios from "axios";

const instance = axios.create({
  baseURL: 'https://03d9ff9d3944.ngrok-free.app/api',
  headers: {'ngrok-skip-browser-warning': 'true'}
});

export default instance;
