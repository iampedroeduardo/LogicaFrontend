import axios from "axios";

const instance = axios.create({
  baseURL: 'https://c8fd65b8e215.ngrok-free.app/api',
  headers: {'ngrok-skip-browser-warning': 'true'}
});

export default instance;
