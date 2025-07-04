import axios from "axios";

const instance = axios.create({
  baseURL: 'https://cb0c-45-227-112-7.ngrok-free.app/api',
//   timeout: 1000,
//   headers: {'X-Custom-Header': 'foobar'}
});

export default instance;
