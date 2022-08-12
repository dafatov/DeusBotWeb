const deus_bot_app_name = 'discord-bot-deus-web';
const deus_bot_app_dyno_name = 'web.1';
const dyno_api_url = `${process.env.REACT_APP_HEROKU_API_URL}/apps/${deus_bot_app_name}/dynos`;

export const getDyno = () =>
  fetch(`${dyno_api_url}/${deus_bot_app_dyno_name}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/vnd.heroku+json; version=3',
      'Authorization': `Bearer ${process.env.REACT_APP_HEROKU_TOKEN}`,
    },
  }).then(r => r.json());
