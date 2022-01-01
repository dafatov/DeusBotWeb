import {Grid} from "@mui/material";
import NowPlayingView from "./NowPlayingView";
import QueueView from "./QueueView";
import ControlView from "./ControlView";
import {useEffect, useState} from "react";
import {useInterval} from "../../utils/UseInterval";
import {useAuth} from "../../security/AuthProvider";
import {useSocket} from "../../security/SocketProvider";

//TODO потенциальная проблема: если при совпадении таймингов регулярного обновления
// и нажатия кнопки, то возникает проблема раннего обновления неакульных данных
const Player = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [, session] = useAuth();
  const socket = useSocket();
  const [songs, setSongs] = useState(null);
  const [nowPlaying, setNowPlaying] = useState(null);
  const [isPendingNowPlaying, setIsPendingNowPlaying] = useState(false);
  const [isPendingSongs, setIsPendingSongs] = useState(false);

  useEffect(() => {
    setIsLoading(isPendingNowPlaying || isPendingSongs);
  }, [isPendingNowPlaying, isPendingSongs])

  useEffect(() => {
    if (session && socket) {
      socket.on("nowPlaying:now", r => {
        setNowPlaying(r);
        setIsPendingNowPlaying(false);
      });
      socket.on("queue:now", r => {
        setSongs(r);
        setIsPendingSongs(false);
      });
    } else {
      setNowPlaying(null);
      setSongs(null);
    }
    return () => {
      socket?.removeAllListeners("nowPlaying:now");
      socket?.removeAllListeners("queue:now");
    }
  }, [session, socket])

  useInterval(() => {
    if (session && socket) {
      socket.emit("nowPlaying:now", session.access_token)
      socket.emit("queue:now", session.access_token)
    }
  }, 10000, [session, socket])

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="flex-start"
      columnSpacing={1}
      sx={{
        paddingRight: 1,
      }}
    >
      <Grid item xs={4}>
        <NowPlayingView nowPlaying={nowPlaying} isLoading={isLoading} setIsLoading={setIsPendingNowPlaying}/>
      </Grid>
      <Grid item xs>
        <QueueView songs={songs} isLoading={isLoading} setIsLoading={setIsPendingSongs}/>
      </Grid>
      <Grid item xs={2}>
        <ControlView isLoading={isLoading} setIsLoading={setIsPendingSongs}/>
      </Grid>
    </Grid>
  );
};

export default Player;