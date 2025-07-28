import axios from "axios";

const instance = axios.create({
  baseURL: 'https://d14c3a8f9842.ngrok-free.app/api',
//   timeout: 1000,
//   headers: {'X-Custom-Header': 'foobar'}
});

export default instance;
