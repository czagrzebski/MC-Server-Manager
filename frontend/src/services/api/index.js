import axios from "axios";
import tokenService from "../token.service";

const baseUrl = "/";

const api = axios.create({
  baseURL: baseUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

//Send Access Token to Express API for every call
api.interceptors.request.use(
  (config) => {
    const token = tokenService.getUserToken();
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//TODO: Check for Invalid Token

export default api;