import axios from "axios";

const instance = axios.create({
  baseURL: 'https://173bb9571ded.ngrok-free.app/api',
  headers: {'ngrok-skip-browser-warning': 'true'}
});

export default instance;
