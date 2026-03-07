import axios from "axios";

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL || "https://daherserver-zgmy.onrender.com",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const googleClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL || "https://daherserver-zgmy.onrender.com",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const invoiceClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL || "https://paynet-main-nasar.onrender.com",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const localClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
invoiceClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers?.set("Authorization", `Bearer ${token}`);
    }

    return config;
  },
  (error) => Promise.reject(error),
);



// Response interceptor
invoiceClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("token");
      window.location.href = "/Alfa/#/login";
    }

    return Promise.reject(error);
  },
);


export default apiClient;
