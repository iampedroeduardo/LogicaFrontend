import axios from "axios";
import Constants from 'expo-constants';

const instance = axios.create({
  baseURL: `${Constants.expoConfig?.extra?.apiUrl}/api`,
});

export default instance;
