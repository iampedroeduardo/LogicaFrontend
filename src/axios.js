import axios from "axios";

const instance = axios.create({
  baseURL: 'https://d2a6e6e13ac5.ngrok-free.app/api',
  headers: {'ngrok-skip-browser-warning': 'true'}
});

export default instance;
