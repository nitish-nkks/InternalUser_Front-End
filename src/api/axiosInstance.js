import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5207/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }

      if (status === 403) {
        alert("You do not have permission to perform this action.");
      }

      if (status >= 500) {
        alert("Server error. Please try again later.");
      }
    } else {
      alert("Network error. Please check your connection.");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;