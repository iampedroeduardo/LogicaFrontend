import axios from "axios";

const instance = axios.create({
<<<<<<< HEAD
  baseURL: 'https://0e2375e624ec.ngrok-free.app/api',
=======
  baseURL: 'https://b045fca9b559.ngrok-free.app/api',
>>>>>>> 7fe99fefb169a5bf222203c0b94919aa738054a9
  headers: {'ngrok-skip-browser-warning': 'true'}
});

export default instance;
