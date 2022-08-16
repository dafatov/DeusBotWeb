import {memo} from 'react';
import {Redirect, Route} from 'react-router-dom';

export const AuthRoute = memo(({logged, ...props}) => {
  return (logged
      ? <Route {...props}/>
      : <Redirect to={{pathname: '/auth'}}/>
  );
});

AuthRoute.displayName = 'AuthRoute';
