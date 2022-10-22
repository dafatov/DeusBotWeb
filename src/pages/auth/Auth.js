import {Box, CircularProgress} from '@mui/material';
import {memo, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router-dom';
import {authorization} from '../../api/securityApi';
import {login, useAuth} from '../../security/AuthProvider';
import {useSnackBar} from '../../utils/snackBar';

export const Auth = memo(() => {
  const {t} = useTranslation();
  const history = useHistory();
  const [logged] = useAuth();
  const {showWarning} = useSnackBar();

  useEffect(() => {
    const code = new URLSearchParams(history.location.search).get('code');

    if (!logged && code) {
      authorization(code)
        .then(s => login(s))
        .then(() => history.replace('/'));
    } else if (!logged && !code) {
      showWarning(t('web:app.auth.warning.noAuth', 'Пожалуйста пройдите авторизацию'));
      history.replace('/');
    } else {
      history.replace('/');
    }
  }, [history, logged, showWarning]);

  return (
    <Box>
      <CircularProgress size={500}/>
    </Box>
  );
});

Auth.displayName = 'Auth';
