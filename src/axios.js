import axios from "axios";

const instance = axios.create({
  baseURL: 'https://1868-2804-18-1127-2fb4-749d-1f81-7de2-2873.ngrok-free.app',
//   timeout: 1000,
//   headers: {'X-Custom-Header': 'foobar'}
});

export default instance;
