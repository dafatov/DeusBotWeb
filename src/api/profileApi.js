import {getHttpProps} from "../utils/httpAssistant";
import {discord_api_url} from "../config";

const user_api_url = `${discord_api_url}/users`

export const getProfile = (session) =>
  fetch(`${user_api_url}/@me`, {
    method: 'GET',
    ...getHttpProps(session),
  }).then(r => r.json());