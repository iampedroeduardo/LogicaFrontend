import axios from "axios";

const instance = axios.create({
  baseURL: 'http://26.201.119.149:3000/api',
//   timeout: 1000,
//   headers: {'X-Custom-Header': 'foobar'}
});

export default instance;
