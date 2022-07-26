import {Card, CardContent, CircularProgress, Paper, Stack, Tooltip, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {Autorenew, HorizontalRule, Pause, PlayArrow, SkipNext} from "@mui/icons-material";
import {useAuth} from "../../security/AuthProvider";
import PlayerTimeline from "../../components/PlayerTimeline";
import {useSnackBar} from "../../utils/SnackBar";
import {LoadingButton} from "@mui/lab";
import {useSocket} from "../../security/SocketProvider";
import {useInterval} from "../../utils/UseInterval";

const NowPlayingView = ({nowPlaying, isLoading, setIsLoading}) => {
  const {showSuccess, showWarning} = useSnackBar();
  const [, session] = useAuth();
  const socket = useSocket();
  const [playbackDuration, setPlaybackDuration] = useState(0);

  useEffect(() => {
    setPlaybackDuration(nowPlaying?.song?.playbackDuration ?? 0);
  }, [nowPlaying?.song?.playbackDuration])

  useInterval(() => {
    setPlaybackDuration(Math.min(playbackDuration + 1000, parseInt(nowPlaying?.song?.length ?? 0) * 1000))
  }, nowPlaying?.song?.isLive || nowPlaying?.isPause ? null : 1025, [])

  const handleSkipButton = () => {
    setIsLoading(true);
    socket.emit("nowPlaying:skip", session.access_token, data => {
      if (data.result) {
        showWarning(data.result);
      } else {
        showSuccess("Успешно пропущена композиция");
      }
    });
  }

  const handlePauseButton = () => {
    setIsLoading(true);
    socket.emit("nowPlaying:pause", session.access_token, data => {
      if (data.result) {
        showWarning(data.result);
      } else {
        showSuccess(`Успешно ${data.isPause ? "приостановлена" : "возобновлена"} композиция`);
      }
    });
  }

  const handleLoopButton = () => {
    setIsLoading(true);
    socket.emit("nowPlaying:loop", session.access_token, data => {
      if (data.result) {
        showWarning(data.result);
      } else {
        showSuccess(`Успешно ${data.isLoop ? "зациклена" : "отциклена"} композиция`);
      }
    });
  }

  return (
    <Card>
      <CardContent>
        <Stack
          direction="column"
          alignItems="center"
          spacing={2}
        >
          {nowPlaying?.song?.preview
            ?
            <img
              src={nowPlaying?.song?.preview}
              style={{
                objectFit: "contain",
                width: "100%",
                height: "100%"
              }}
              alt="Обложка проигрываемой композиции"
            />
            :
            <Paper elevation={4} sx={{
              width: "100%",
              aspectRatio: "1.75",
              display: "flex",
              flexWrap: "wrap",
              alignContent: "center",
              justifyContent: "center"
            }}>
              {nowPlaying ? <></> : <CircularProgress size="30%"/>}
            </Paper>
          }
          <Paper elevation={4} sx={{padding: 0.75, minWidth: "48px", minHeight: "24px"}}>
            <Typography>
              {nowPlaying?.song?.title ?? ""}
            </Typography>
          </Paper>
          {nowPlaying?.song
            ?
            <PlayerTimeline
              playbackDuration={playbackDuration}
              totalDuration={parseInt(nowPlaying?.song?.length ?? 0) * 1000}
              authorLink={nowPlaying?.song?.author?.avatarURL}
              authorName={nowPlaying?.song?.author?.username}
              isLive={nowPlaying?.song?.isLive}
            />
            :
            <Paper elevation={4} sx={{width: "100%", height: "40px"}}/>
          }
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
          >
            <Tooltip title={nowPlaying?.isLoop ? "Отциклить" : "Зациклить"}>
              <span>
                <LoadingButton
                  loading={isLoading}
                  variant="outlined"
                  color="primary"
                  value="loop"
                  size="large"
                  aria-label={nowPlaying?.isLoop ? "Отциклить" : "Зациклить"}
                  disabled={nowPlaying?.song?.isLive ?? true}
                  onClick={handleLoopButton}
                  sx={{padding: "15px", minWidth: "56px"}}
                >
                  {nowPlaying?.isLoop ? <Autorenew/> : <HorizontalRule/>}
                </LoadingButton>
              </span>
            </Tooltip>
            <Tooltip title={nowPlaying?.isPause ? "Возобновить" : "Приостановить"}>
                <span>
                  <LoadingButton
                    loading={isLoading}
                    variant="outlined"
                    color="primary"
                    value="pause"
                    size="large"
                    aria-label={nowPlaying?.isPause ? "Возобновить" : "Приостановить"}
                    disabled={nowPlaying?.song?.isLive ?? true}
                    onClick={handlePauseButton}
                    sx={{padding: "15px", minWidth: "56px"}}
                  >
                    {nowPlaying?.isPause ? <PlayArrow/> : <Pause/>}
                  </LoadingButton>
                </span>
            </Tooltip>
            <Tooltip title="Пропустить">
                <span>
                  <LoadingButton
                    loading={isLoading}
                    variant="outlined"
                    color="primary"
                    value="skip"
                    size="large"
                    aria-label="Пропустить"
                    disabled={!nowPlaying?.song}
                    onClick={handleSkipButton}
                    sx={{padding: "15px", minWidth: "56px"}}
                  >
                    <SkipNext/>
                  </LoadingButton>
                </span>
            </Tooltip>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default NowPlayingView;