import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default {
  login: user => {
    console.log(user);
    return instance.post('/user/login', user)
      .then(res => res.data)
      .catch(error => {
        console.error('Login error:', error);
        throw error;
      });
  },
  register: user => {
    console.log(user);
    return instance.post('/user/signup', user)
      .then(res => res.data)
      .catch(error => {
        console.error('Registration error:', error);
        throw error;
      });
  },
  logout: () => {
    return instance.post('/user/logout')
      .then(res => res.data)
      .catch(error => {
        console.error('Logout error:', error);
        throw error;
      });
  },
  isAuthenticated: () => {
    return instance.get('/user/authenticated')
      .then(res => res.data)
      .catch(error => {
        console.error('Authentication error:', error);
        throw error;
      });
  }
}
