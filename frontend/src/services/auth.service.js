import api from "./api";
import tokenService from "./token.service";

const AUTH_ENDPOINT = "/auth/";

class AuthService {
  login(username, password) {
    api
      .post(AUTH_ENDPOINT + "login", { username, password })
      .then((response) => {
        if (response.data.accessToken) {
          console.log(response.data.accessToken);
          tokenService.setUserToken(response.data.accessToken);
        }

        return response.data;
      });
  }

  fetchRefreshToken() {
    api
      .post(AUTH_ENDPOINT + "refresh_token", { withCredentials: true })
      .then((response) => {
        console.log(response);
        if (response.data.accessToken) {
          tokenService.setUserToken(response.data.accessToken);
        }

        return response.data;
      }).catch(err => console.log(err));
  }

  logout() {
    tokenService.setUserToken("");
  }

  register(username, password) {
    return api.post(AUTH_ENDPOINT + "create", {
      username,
      password,
    });
  }
}

export default new AuthService();
