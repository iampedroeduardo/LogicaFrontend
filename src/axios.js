import axios from "axios";

const instance = axios.create({
  baseURL: 'https://a609ae215ff6.ngrok-free.app/api',
  headers: {'ngrok-skip-browser-warning': 'true'}
});

export default instance;
