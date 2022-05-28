let configLocal;

try {
  configLocal = require("./configLocal");
} catch (e) {
  console.log(e)
}

module.exports = {
  'client_uri': process.env.CLIENT_URI || configLocal.client_uri,
  'server_uri': process.env.SERVER_URI || configLocal.server_uri,
  'discord_api_url': process.env.DISCORD_API_URL || configLocal.discord_api_url,
  'discord_cdn_url': process.env.DISCORD_CDN_URL || configLocal.discord_cdn_url,
  'client_id': process.env.CLIENT_ID || configLocal.client_id,
  'client_secret': process.env.CLIENT_SECRET || configLocal.client_secret,
}