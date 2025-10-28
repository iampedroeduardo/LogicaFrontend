import axios from "axios";

const instance = axios.create({
  baseURL: 'https://56b8e92d46e0.ngrok-free.app/api',
  headers: {'ngrok-skip-browser-warning': 'true'}
});

export default instance;
