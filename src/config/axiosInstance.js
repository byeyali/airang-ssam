import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://airang-apin.azurewebsites.net",
  withCredentials: true,
});

export default axiosInstance;
