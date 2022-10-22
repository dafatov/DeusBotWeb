import {Redirect, Route} from 'react-router-dom';
import {CircularProgress} from '@mui/material';
import {memo} from 'react';

export const AuthRoute = memo(({session, scope, ...props}) => {
  const isForbidden = !JSON.parse(localStorage.getItem('REACT_APP_SCOPES') || '[]')
    .includes(scope);

  if (typeof session === 'undefined' || typeof scope === 'undefined') {
    return <CircularProgress/>;
  }

  return (session
      ? isForbidden
        ? <Redirect to={{pathname: '/forbidden'}}/>
        : <Route {...props}/>
      : <Redirect to={{pathname: '/auth'}}/>
  );
});

AuthRoute.displayName = 'AuthRoute';
