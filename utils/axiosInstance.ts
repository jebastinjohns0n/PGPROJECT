import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8090/api", // Replace with your backend URL
  timeout: 10000,
});

export default axiosInstance;