import axios from 'axios';


const api = axios.create({
  baseURL : `${import.meta.env.VITE_API_URL}/api`,
  //baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  }
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    
    console.log('Making request to:', `${config.baseURL}${config.url}`);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }


    console.log('Request details:', {
      fullUrl: `${config.baseURL}${config.url}`,
      method: config.method?.toUpperCase(),
      headers: config.headers,
      data: config.data
    });

    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => {
    console.log('Response received:', {
      url: `${response.config.baseURL}${response.config.url}`,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {

    const errorInfo = {
      url: `${error.config?.baseURL}${error.config?.url}`,
      method: error.config?.method?.toUpperCase(),
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    };

   
    if (error.response?.status === 401) {
      console.error('Authentication error:', errorInfo);
    
      localStorage.removeItem('token');
    } else if (!error.response) {
      console.error('Network error - no response from server:', errorInfo);
    } else {
      console.error(`Error ${error.response.status}:`, errorInfo);
    }

    return Promise.reject(error);
  }
);

export default api;