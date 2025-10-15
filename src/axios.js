import axios from "axios";

const instance = axios.create({
  baseURL: 'https://c6779d56e711.ngrok-free.app/api',
//   timeout: 1000,
  headers: {'ngrok-skip-browser-warning': 'true'}
});

export default instance;
