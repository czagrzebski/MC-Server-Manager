import axios from "axios";
import tokenService from "../token.service";
import authService from "../auth.service";

//Base URL, using Proxy to Backend
const baseUrl = "/";

//Create Axios Instance for Accessing Resources 
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
    if (
      originalConfig.url !== "/auth/login" &&
      originalConfig.url !== "/auth/refresh_token" &&
      err.response 
    ) {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        //Retry original failed request after re-authentication
        originalConfig._retry = true;

        try {
          //Attempt to get a new Access Token using Refresh Token
          return await api
            .post("/auth/refresh_token", {
              withCredentials: true,
            })
            .then((response) => {
              const { accessToken } = response.data;
              tokenService.setUserToken(accessToken);
              return api(originalConfig);
            })
            .catch((_error) => {
              //If refresh token is invalid (401), then logout.
              if (err.response.status === 401) {
                authService.logout();
                return Promise.reject(_error);
              }
            });
        } catch (error) {
          return Promise.reject(error);
        }
      }
    }

    return Promise.reject(err);
  }
);

export default api;
