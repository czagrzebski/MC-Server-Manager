import api from "./api";
import tokenService from "./token.service";

const AUTH_ENDPOINT = "/auth/";

class AuthService {
  async login(username, password) {
    return await api
      .post(AUTH_ENDPOINT + "login", { username, password })
      .then((response) => {
        if (response.data.accessToken) {
          tokenService.setUserToken(response.data.accessToken);
        }

        return response.data;
      });
  }

  async fetchRefreshToken() {
    return await api
      .post(AUTH_ENDPOINT + "refresh_token", { withCredentials: true })
      .then((response) => {
        if (response.data.accessToken) {
          tokenService.setUserToken(response.data.accessToken);
        }

        return response.data;
      })
  }

  async logout() {
    tokenService.removeUserToken();
    api
      .post(AUTH_ENDPOINT + "logout", { withCredentials: true })
      .then((response) => {
        return response.data;
      })
  }

  async register(username, password) {
    return api.post(AUTH_ENDPOINT + "create", {
      username,
      password,
    });
  }
}

export default new AuthService();
