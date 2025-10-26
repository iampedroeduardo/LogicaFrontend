import axios from "axios";

const instance = axios.create({
  baseURL: 'https://50d61bf235c3.ngrok-free.app/api',
  headers: {'ngrok-skip-browser-warning': 'true'}
});

export default instance;
