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

//Validate Access Token. If token is invalid, fetch a new one and reprocess the request
api.interceptors.response.use(
  (response) => {
    //Successful Response, do nothing.
    return response;
  },
  async (err) => {
    const originalConfig = err.config;

    //Do not retrieve new rs token if a invalid login caused 401 response
    if (originalConfig.url !== "/auth/login" && err.response) {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;

        try {
          //Attempt to get a new Access Token
          const rs = await api.post("/auth/refresh_token", {
            withCredentials: true,
          });

          const { accessToken } = rs.data;
          tokenService.setUserToken(accessToken);

          return api(originalConfig);
        } catch (error) {
          return Promise.reject(error);
        }
      }
    }

    return Promise.reject(err);
  }
);

export default api;
