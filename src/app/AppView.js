import {Stack} from '@mui/material';
import {useEffect} from 'react';
import {Route, Switch} from 'react-router-dom';
import {getDyno} from '../api/herokuApi';
import Bar from '../bar/Bar';
import AuthRoute from '../components/AuthRoute';
import changelog from '../configs/changelog';
import Administration from '../pages/administration/Administration';
import Auth from '../pages/auth/Auth';
import Landing from '../pages/landing/Landing';
import NotFound from '../pages/not_found/NotFound';
import Player from '../pages/player/Player';
import {useAuth} from '../security/AuthProvider';
import {useSocket} from '../security/SocketProvider';

const AppView = () => {
  const [logged] = useAuth();
  const socket = useSocket();

  useEffect(() => {
    if (socket) {
      getDyno().then(dynoInfo => `v${dynoInfo?.release?.version}`)
        .then(version => {
          if (localStorage.getItem('REACT_APP_HEROKU_RELEASE_VERSION') !== version) {
            socket.emit('changelog:publish', version, changelog, v => {
              if (v) {
                localStorage.setItem('REACT_APP_HEROKU_RELEASE_VERSION', v);
              }
            });
          }
        });
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
};

export default AppView;
