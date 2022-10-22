import {Route, Switch} from 'react-router-dom';
import {memo, useEffect, useState} from 'react';
import {Administration} from '../pages/administration/Administration';
import {Auth} from '../pages/auth/Auth';
import {AuthRoute} from '../components/authRoute/AuthRoute';
import {Bar} from '../bar/Bar';
import {Forbidden} from '../pages/forbidden/Forbidden';
import {Landing} from '../pages/landing/Landing';
import {NotFound} from '../pages/notFound/NotFound';
import {Player} from '../pages/player/Player';
import {Stack} from '@mui/material';
import changelog from '../configs/changelog';
import {useAuth} from '../security/AuthProvider';
import {useSocket} from '../security/SocketProvider';

export const AppView = memo(() => {
  const [, session] = useAuth();
  const socket = useSocket();
  const [SCOPES, setScopes] = useState(undefined);

  useEffect(() => {
    if (socket && localStorage.getItem('REACT_APP_VERSION') !== process.env.REACT_APP_VERSION) {
      socket.emit('changelog:publish', process.env.REACT_APP_VERSION, changelog, version => {
        if (version) {
          localStorage.setItem('REACT_APP_VERSION', version);
        }
      });
    }
  }, [socket]);

  useEffect(() => {
    (async () => {
      if (socket && session) {
        await new Promise(resolve =>
          socket.emit('permission:getUserScopes', session.access_token, r => {
            resolve(r.scopes);
          })).then(scopes => localStorage.setItem('REACT_APP_SCOPES', JSON.stringify(scopes)))
          .catch(() => localStorage.setItem('REACT_APP_SCOPES', JSON.stringify([])));
      }
    })();
  }, [session, socket]);

  useEffect(() => {
    (async () => {
      if (socket && session) {
        await new Promise(resolve =>
          socket.emit('permission:getScopesDictionary', r => {
            resolve(r.SCOPES);
          })).then(scopes => setScopes(Object.freeze(scopes)));
      }
    })();
  }, [session, socket]);

  return (
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="center"
      spacing={1}
    >
      <Bar/>
      <Switch>
        <Route path="/" component={Landing} exact/>
        <Route path="/auth" component={Auth} exact/>
        <Route path="/forbidden" component={Forbidden} exact/>
        <AuthRoute session={session} scope={SCOPES?.PAGE_PLAYER} path="/player" component={Player} exact/>
        <AuthRoute session={session} scope={SCOPES?.PAGE_ADMINISTRATION} path="/administration" component={Administration} exact/>
        <Route path="/" component={NotFound}/>
      </Switch>
    </Stack>
  );
});

AppView.displayName = 'AppView';
