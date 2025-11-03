import axios from "axios";

const instance = axios.create({
  baseURL: 'https://95034d3a38a5.ngrok-free.app/api',
  headers: {'ngrok-skip-browser-warning': 'true'}
});

export default instance;
