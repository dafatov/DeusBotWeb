const discord_auth_url = `${process.env.REACT_APP_DISCORD_API_URL}/oauth2/token`;

export const redirect_url = `http${process.env.PORT ? "s" : ""}://${process.env.REACT_APP_CLIENT_URI}/auth`;

export const authorization = (code) =>
  fetch(discord_auth_url, {
    method: 'POST',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      "grant_type": "authorization_code",
      client_id: process.env.REACT_APP_CLIENT_ID,
      client_secret: process.env.REACT_APP_CLIENT_SECRET,
      code,
      redirect_uri: redirect_url
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
      client_id: process.env.REACT_APP_CLIENT_ID,
      client_secret: process.env.REACT_APP_CLIENT_SECRET,
      refresh_token
    })
  }).then(r => r.json());