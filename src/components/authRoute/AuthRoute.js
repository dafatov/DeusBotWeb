import {memo} from 'react';
import {Redirect, Route} from 'react-router-dom';

export const AuthRoute = memo(({session, scope, ...props}) => {
  const isForbidden = !JSON.parse(localStorage.getItem('REACT_APP_SCOPES') || '[]')
    .includes(scope);

  return (session
      ? isForbidden
        ? <Redirect to={{pathname: '/forbidden'}}/>
        : <Route {...props}/>
      : <Redirect to={{pathname: '/auth'}}/>
  );
});

AuthRoute.displayName = 'AuthRoute';
