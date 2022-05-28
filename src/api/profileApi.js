import {getHttpProps} from "../utils/httpAssistant";

const user_api_url = `${process.env.REACT_APP_DISCORD_API_URL}/users`

export const getProfile = (session) =>
  fetch(`${user_api_url}/@me`, {
    method: 'GET',
    ...getHttpProps(session),
  }).then(r => r.json());