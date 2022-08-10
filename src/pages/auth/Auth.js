import {Box, CircularProgress} from '@mui/material';
import {useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {authorization} from '../../api/securityApi';
import {login, useAuth} from '../../security/AuthProvider';
import {useSnackBar} from '../../utils/SnackBar';

const Auth = () => {
  const history = useHistory();
  const [logged] = useAuth();
  const {showWarning} = useSnackBar();

  useEffect(() => {
    const code = new URLSearchParams(history.location.search).get('code');

    if (!logged && code) {
      authorization(code)
        .then(s => login(s))
        .then(() => history.replace("/"));
    } else if (!logged && !code) {
      showWarning("Пожалуйста пройдите авторизацию");
      history.replace("/");
    } else {
      history.replace("/");
    }
  }, [history, history.location, logged, showWarning]);

  return (
    <Box>
      <CircularProgress size={500}/>
    </Box>
  );
};

export default Auth;
