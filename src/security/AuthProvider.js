import {createAuthProvider} from 'react-token-oauth2';
import {reauthorization} from '../api/securityApi';

export const {authFetch, useAuth, login, logout} = createAuthProvider({
  getAccessToken: session => session.access_token,
  getExpiresIn: session => session.expires_in,
  onUpdateToken: session => reauthorization(session.refresh_token).catch(() => logout()),
});
