import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !window.location.pathname.startsWith("/login") &&
      !window.location.pathname.startsWith("/auth/")
    ) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
