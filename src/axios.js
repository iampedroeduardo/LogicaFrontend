import axios from "axios";

const instance = axios.create({
  baseURL: 'https://57138ba0b833.ngrok-free.app/api',
//   timeout: 1000,
//   headers: {'X-Custom-Header': 'foobar'}
});

export default instance;
