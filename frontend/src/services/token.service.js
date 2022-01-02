import store from "../app/store";
import { setToken } from "../app/slices/userSlice";

class TokenService {
    getUserToken = () => {
        return store.getState().user.accessToken;
    }
    setUserToken = (token) => {
        store.dispatch(setToken(token));
    }
}

export default new TokenService();