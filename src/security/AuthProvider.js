import {createAuthProvider} from "react-token-auth";
import {reauthorization} from "../api/securityApi";

export const {useAuth, authFetch, login, logout} = createAuthProvider({
  getAccessToken: session => session.accessToken,
  expirationThresholdMillisec: 3000,
  storage: localStorage,
  onUpdateToken: token =>
    reauthorization(token.refresh_token).catch(() => logout()),
});