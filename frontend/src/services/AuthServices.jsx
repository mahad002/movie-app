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
      // Assuming the API returns a token and user info without including the password
      if (res.data && res.data.token) {
        localStorage.setItem('userToken', res.data.token); // Store the authentication token
        const { password, ...safeUserData } = res.data.user; // Destructure to exclude password if it's accidentally included
        localStorage.setItem('userInfo', JSON.stringify(safeUserData)); // Store user info, ensuring password is not included
      }
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
      // Clear all local storage items related to user session on logout
      localStorage.removeItem('userToken');
      localStorage.removeItem('userInfo');
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
