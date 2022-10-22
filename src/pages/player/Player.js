import {memo, useEffect, useState} from 'react';
import {Control} from '../../components/control/Control';
import {Grid} from '@mui/material';
import {NowPlaying} from '../../components/nowPlaying/NowPlaying';
import {Queue} from '../../components/queue/Queue';
import {useAuth} from '../../security/AuthProvider';
import {useInterval} from '../../utils/useInterval';
import {useSocket} from '../../security/SocketProvider';
import {useStyles} from './playerStyles';

//TODO потенциальная проблема: если при совпадении таймингов регулярного обновления
// и нажатия кнопки, то возникает проблема раннего обновления неактуальных данных
export const Player = memo(() => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(true);
  const [logged, session] = useAuth();
  const socket = useSocket();
  const [songs, setSongs] = useState(null);
  const [nowPlaying, setNowPlaying] = useState(null);
  const [isPendingNowPlaying, setIsPendingNowPlaying] = useState(false);
  const [isPendingSongs, setIsPendingSongs] = useState(false);

  useEffect(() => {
    setIsLoading(isPendingNowPlaying || isPendingSongs);
  }, [isPendingNowPlaying, isPendingSongs]);

  useEffect(() => {
    if (logged && socket) {
      socket.on('nowPlaying:now', r => {
        setNowPlaying(r);
        setIsPendingNowPlaying(false);
      });
      socket.on('queue:now', r => {
        setSongs(r);
        setIsPendingSongs(false);
      });
    } else {
      setNowPlaying(null);
      setSongs(null);
    }
    return () => {
      socket?.removeAllListeners('nowPlaying:now');
      socket?.removeAllListeners('queue:now');
    };
  }, [logged, socket]);

  useInterval(() => {
    if (logged && socket) {
      socket.emit('nowPlaying:now', session.access_token);
      socket.emit('queue:now', session.access_token);
    }
  }, 10000, [logged, session, socket]);

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="flex-start"
      columnSpacing={1}
      className={classes.root}
    >
      <Grid item xs={4}>
        <NowPlaying nowPlaying={nowPlaying} isLoading={isLoading} setIsLoading={setIsPendingNowPlaying}/>
      </Grid>
      <Grid item xs>
        <Queue songs={songs} isLoading={isLoading} setIsLoading={setIsPendingSongs}/>
      </Grid>
      <Grid item xs={2}>
        <Control isLoading={isLoading} setIsLoading={setIsPendingSongs}/>
      </Grid>
    </Grid>
  );
});
Player.displayName = 'Player';
