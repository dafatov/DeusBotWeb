import {Stack} from '@mui/material';
import {memo, useEffect} from 'react';
import {Route, Switch} from 'react-router-dom';
import {getDyno} from '../api/herokuApi';
import {Bar} from '../bar/Bar';
import {AuthRoute} from '../components/authRoute/AuthRoute';
import changelog from '../configs/changelog';
import {Administration} from '../pages/administration/Administration';
import {Auth} from '../pages/auth/Auth';
import {Landing} from '../pages/landing/Landing';
import {NotFound} from '../pages/notFound/NotFound';
import {Player} from '../pages/player/Player';
import {useAuth} from '../security/AuthProvider';
import {useSocket} from '../security/SocketProvider';

export const AppView = memo(() => {
  const [logged] = useAuth();
  const socket = useSocket();

  useEffect(() => {
    if (socket) {
      getDyno().then(dynoInfo => `v${dynoInfo.release.version}`)
        .then(version => {
          if (localStorage.getItem('REACT_APP_HEROKU_RELEASE_VERSION') !== version) {
            socket.emit('changelog:publish', version, changelog, realVersion => {
              if (realVersion) {
                localStorage.setItem('REACT_APP_HEROKU_RELEASE_VERSION', realVersion);
              }
            });
          }
        }).catch(() => {});
    }
  }, [socket]);

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
        <AuthRoute logged={logged} path="/player" component={Player} exact/>
        <AuthRoute logged={logged} path="/administration" component={Administration} exact/>
        <Route path="/" component={NotFound}/>
      </Switch>
    </Stack>
  );
});

AppView.displayName = 'AppView';
