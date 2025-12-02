import axios from "axios";

const instance = axios.create({
  baseURL: 'https://0e2375e624ec.ngrok-free.app/api',
  headers: {'ngrok-skip-browser-warning': 'true'}
});

export default instance;
