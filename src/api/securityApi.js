import {client_id, client_secret, client_uri, discord_api_url} from "../config";

const discord_auth_url = `${discord_api_url}/oauth2/token`;
export const redirect_url = `https://${client_uri}/auth`;

export const authorization = (code) =>
  fetch(discord_auth_url, {
    method: 'POST',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      "grant_type": "authorization_code",
      client_id,
      client_secret,
      code,
      redirect_url
    })
  }).then(r => r.json());

export const reauthorization = (refresh_token) =>
  fetch(discord_auth_url, {
    method: 'POST',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      "grant_type": "refresh_token",
      client_id,
      client_secret,
      refresh_token
    })
  }).then(r => r.json());