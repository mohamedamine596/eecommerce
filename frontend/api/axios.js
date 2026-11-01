import axios from "axios";

const apiBaseUrl =
  import.meta.env.VITE_API_URL ||
  `${window.location.protocol}//${window.location.hostname}:3000/api/v1`;

const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      error.response?.data?.message === "Access Token expired" &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/user/refresh-token")
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      isRefreshing = true;
      try {
        await api.post("/user/refresh-token"); // 🍪 sets new token via cookie
        isRefreshing = false;
        processQueue(null);
        return api(originalRequest); // 🔁 retry
      } catch (err) {
        isRefreshing = false;
        processQueue(err, null);
        localStorage.removeItem("user");
        window.location.href = "/";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
