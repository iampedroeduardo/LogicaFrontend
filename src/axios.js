import axios from "axios";

const instance = axios.create({
  baseURL: 'https://4dcdfc4561f0.ngrok-free.app/api',
  headers: {'ngrok-skip-browser-warning': 'true'}
});

export default instance;
