import axios from "axios";

const instance = axios.create({
  baseURL: 'https://1f516c013342.ngrok-free.app/api',
  headers: {'ngrok-skip-browser-warning': 'true'}
});

export default instance;
