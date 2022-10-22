import {Autorenew, HorizontalRule, Pause, PlayArrow, SkipNext} from '@mui/icons-material';
import {Card, CardContent, CircularProgress, Paper, Stack, Tooltip, Typography} from '@mui/material';
import {memo, useCallback, useEffect, useState} from 'react';
import {LoadingButton} from '@mui/lab';
import {PlayerTimeline} from '../playerTimeline/PlayerTimeline';
import {useAuth} from '../../security/AuthProvider';
import {useInterval} from '../../utils/useInterval';
import {useSnackBar} from '../../utils/snackBar';
import {useSocket} from '../../security/SocketProvider';
import {useStyles} from './nowPlayingStyles';
import {useTranslation} from 'react-i18next';

export const NowPlaying = memo(({nowPlaying, isLoading, setIsLoading}) => {
  const classes = useStyles();
  const {t} = useTranslation();
  const {showSuccess, showWarning} = useSnackBar();
  const [, session] = useAuth();
  const socket = useSocket();
  const [playbackDuration, setPlaybackDuration] = useState(0);

  useEffect(() => {
    setPlaybackDuration(nowPlaying?.song?.playbackDuration ?? 0);
  }, [nowPlaying?.song?.playbackDuration]);

  useInterval(() => {
    setPlaybackDuration(Math.min(playbackDuration + 1000, parseInt(nowPlaying?.song?.length ?? 0) * 1000));
  }, nowPlaying?.song?.isLive || nowPlaying?.isPause
    ? null
    : 1025, []);

  const handleSkipButton = useCallback(() => {
    setIsLoading(true);
    socket.emit('nowPlaying:skip', session.access_token, data => {
      if (data.result) {
        showWarning(data.result);
      } else {
        showSuccess(t('web:app.nowPlaying.success.skipped', 'Успешно пропущена композиция'));
      }
    });
  }, [setIsLoading, socket, session, showWarning, showSuccess]);

  const handlePauseButton = useCallback(() => {
    setIsLoading(true);
    socket.emit('nowPlaying:pause', session.access_token, data => {
      if (data.result) {
        showWarning(data.result);
      } else {
        showSuccess(t('web:app.nowPlaying.success.skipped', 'Успешно {{action}} композиция'), {
          action: data.isPause
            ? t('common:app.paused', 'приостановлена')
            : t('common:app.resumed', 'возобновлена'),
        });
      }
    });
  }, [setIsLoading, socket, session, showWarning, showSuccess]);

  const handleLoopButton = useCallback(() => {
    setIsLoading(true);
    socket.emit('nowPlaying:loop', session.access_token, data => {
      if (data.result) {
        showWarning(data.result);
      } else {
        showSuccess(t('web:app.nowPlaying.success.looped', 'Успешно {{action}} композиция'), {
          action: data.isLoop
            ? t('common:app.looped', 'зациклена')
            : t('common:app.unlooped', 'отциклена'),
        });
      }
    });
  }, [setIsLoading, socket, session, showWarning, showSuccess]);

  return (
    <Card>
      <CardContent>
        <Stack
          direction="column"
          alignItems="center"
          spacing={2}
        >
          {nowPlaying?.song?.preview
            ? <img
              src={nowPlaying?.song?.preview}
              className={classes.preview}
              alt="Now playing song cover"
            />
            : <Paper elevation={4} className={classes.defaultPreview}>
              {nowPlaying
                ? <></>
                : <CircularProgress size="30%"/>}
            </Paper>
          }
          <Paper elevation={4} className={classes.title}>
            <Typography>
              {nowPlaying?.song?.title ?? ''}
            </Typography>
          </Paper>
          {nowPlaying?.song
            ? <PlayerTimeline
              playbackDuration={playbackDuration}
              totalDuration={parseInt(nowPlaying?.song?.length ?? 0) * 1000}
              authorLink={nowPlaying?.song?.author?.avatarURL}
              authorName={nowPlaying?.song?.author?.username}
              isLive={nowPlaying?.song?.isLive}
            />
            : <Paper elevation={4} className={classes.defaultTimeline}/>
          }
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
          >
            <Tooltip title={nowPlaying?.isLoop
              ? t('common:app.toUnloop', 'Отциклить')
              : t('common:app.toLoop', 'Зациклить')}>
              <span>
                <LoadingButton
                  loading={isLoading}
                  variant="outlined"
                  color="primary"
                  value="loop"
                  size="large"
                  aria-label={nowPlaying?.isLoop
                    ? t('common:app.toUnloop', 'Отциклить')
                    : t('common:app.toLoop', 'Зациклить')}
                  disabled={nowPlaying?.song?.isLive ?? true}
                  onClick={handleLoopButton}
                  className={classes.loadingButton}
                >
                  {nowPlaying?.isLoop
                    ? <Autorenew/>
                    : <HorizontalRule/>}
                </LoadingButton>
              </span>
            </Tooltip>
            <Tooltip title={nowPlaying?.isPause
              ? t('common:app.toResume', 'Возобновить')
              : t('common:app.toPause', 'Приостановить')}>
              <span>
                <LoadingButton
                  loading={isLoading}
                  variant="outlined"
                  color="primary"
                  value="pause"
                  size="large"
                  aria-label={nowPlaying?.isPause
                    ? t('common:app.toResume', 'Возобновить')
                    : t('common:app.toPause', 'Приостановить')}
                  disabled={nowPlaying?.song?.isLive ?? true}
                  onClick={handlePauseButton}
                  className={classes.loadingButton}
                >
                  {nowPlaying?.isPause
                    ? <PlayArrow/>
                    : <Pause/>}
                </LoadingButton>
              </span>
            </Tooltip>
            <Tooltip title={t('common:app.toSkip', 'Пропустить')}>
              <span>
                <LoadingButton
                  loading={isLoading}
                  variant="outlined"
                  color="primary"
                  value="skip"
                  size="large"
                  aria-label={t('common:app.toSkip', 'Пропустить')}
                  disabled={!nowPlaying?.song}
                  onClick={handleSkipButton}
                  className={classes.loadingButton}
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
});

NowPlaying.displayName = 'NowPlaying';
