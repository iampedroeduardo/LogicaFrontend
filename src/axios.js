import axios from "axios";

const instance = axios.create({
  baseURL: 'https://1db6fd200b25.ngrok-free.app/api',
//   timeout: 1000,
//   headers: {'X-Custom-Header': 'foobar'}
});

export default instance;
