import {authFetch} from '../security/AuthProvider';

const user_api_url = `${process.env.REACT_APP_DISCORD_API_URL}/users`;

export const getProfile = () =>
  authFetch(`${user_api_url}/@me`, {
    method: 'GET',
  }).then(r => r.json());
