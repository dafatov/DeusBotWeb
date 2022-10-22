import {Box, CircularProgress} from '@mui/material';
import {login, useAuth} from '../../security/AuthProvider';
import {memo, useEffect} from 'react';
import {authorization} from '../../api/securityApi';
import {useHistory} from 'react-router-dom';
import {useSnackBar} from '../../utils/snackBar';
import {useTranslation} from 'react-i18next';

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
