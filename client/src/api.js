import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3001',
});

instance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('access_token'); 
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    alert('Error in request');
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;  
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Optionally handle 401 errors here
      localStorage.removeItem('access_token');
      // Optionally redirect to login page
      window.location.href = '/login'; // Adjust this to your login route
    }
    return Promise.reject(error);
  }
);

export default instance;
