export const throwHttpErrors = (response) => {
  if (response.status >= 500 && response.status <= 599) {
    return new Promise((resolve, reject) => reject(`${response.status} ${response.statusText}}`));
  }
  return response;
}

export const getHttpProps = (session) => {
  return {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Bearer ${session.access_token}`
    }
  };
}