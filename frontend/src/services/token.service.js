import store from "../app/store";
import { setToken, setCurrentUser } from "../app/slices/userSlice";
import jwt from "jwt-decode";

class TokenService {
  getUserToken = () => {
    return store.getState().user.accessToken;
  };
  setUserToken = (token) => {
    store.dispatch(setToken(token));
    store.dispatch(setCurrentUser(jwt(token)));
  };

  //Sets current access token and user to null
  removeUserToken = () => {
    store.dispatch(setToken(null));
    store.dispatch(
      setCurrentUser({
        id: null,
        username: null
      })
    );
  };
}

export default new TokenService();
