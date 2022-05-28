const {client_id, client_secret, client_uri, discord_api_url, discord_cdn_url, server_uri} = require("./configLocal");

module.exports = {
  'client_uri': process.env.CLIENT_URI || client_uri,
  'server_uri': process.env.SERVER_URI || server_uri,
  'discord_api_url': process.env.DISCORD_API_URL || discord_api_url,
  'discord_cdn_url': process.env.DISCORD_CDN_URL || discord_cdn_url,
  'client_id': process.env.CLIENT_ID || client_id,
  'client_secret': process.env.CLIENT_SECRET || client_secret,
}