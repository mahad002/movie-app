import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default {
  login: async (user) => {
    try {
      const res = await instance.post('/user/login', user);
      console.log("res.data: ", res.data);
      return res.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  register: async user => {
    console.log(user);
    try {
      const res = await instance.post('/user/signup', user);
      return res.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  logout: async () => {
    try {
      const res = await instance.post('/user/logout');
      return res.data;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },
  isAuthenticated: async (id) => {
    try {
      const res = await instance.get('/user/authenticated', {
        params: { id },
      });
      return res.data;
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  },
}
