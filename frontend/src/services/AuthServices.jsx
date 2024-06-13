import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const setCookie = (name, value, days) => {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

const deleteCookie = (name) => {
  document.cookie = name + '=; Max-Age=-99999999;';
}

export default {
  login: async (user) => {
    try {
      const res = await instance.post('/user/login', user);
      console.log("res.data: ", res.data);
      if (res.data && res.data.token) {
        localStorage.setItem('userToken', res.data.token); // Store the authentication token in localStorage
        setCookie('userToken', res.data.token, 7); // Store the token in a cookie for 7 days
        
        const { password, ...safeUserData } = res.data.user;
        localStorage.setItem('userInfo', JSON.stringify(safeUserData)); // Store user info in localStorage
        setCookie('userInfo', JSON.stringify(safeUserData), 7); // Store user info in a cookie for 7 days
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
      localStorage.removeItem('userToken'); // Clear token from localStorage
      localStorage.removeItem('userInfo'); // Clear user info from localStorage
      deleteCookie('userToken'); // Clear token from cookies
      deleteCookie('userInfo'); // Clear user info from cookies
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
