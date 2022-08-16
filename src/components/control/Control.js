import {ClearAll, Shuffle} from '@mui/icons-material';
import {LoadingButton} from '@mui/lab';
import {Card, CardContent, Divider, Paper, Stack, Tooltip, Typography} from '@mui/material';
import {memo, useCallback} from 'react';
import {useAuth} from '../../security/AuthProvider';
import {useSocket} from '../../security/SocketProvider';
import {useSnackBar} from '../../utils/snackBar';
import {Radio} from '../injection/radio/Radio';
import {Shikimori} from '../injection/shikimori/Shikimori';
import {Youtube} from '../injection/youtube/Youtube';
import {useStyles} from './controlStyles';

export const Control = memo(({isLoading, setIsLoading}) => {
  const classes = useStyles();
  const {showSuccess, showWarning} = useSnackBar();
  const [, session] = useAuth();
  const socket = useSocket();

  const handleShuffleButton = useCallback(() => {
    setIsLoading(true);
    socket.emit('control:shuffle', session.access_token, data => {
      if (data.result) {
        showWarning(data.result);
      } else {
        showSuccess('Успешно перемешана очередь');
      }
    });
  }, [setIsLoading, socket, session, showWarning, showSuccess]);

  const handleClearButton = useCallback(() => {
    setIsLoading(true);
    socket.emit('control:clear', session.access_token, data => {
      if (data.result) {
        showWarning(data.result);
      } else {
        showSuccess('Успешно очищена очередь');
      }
    });
  }, [setIsLoading, socket, session, showWarning, showSuccess]);

  const handleYoutubeSubmit = useCallback((audio) => {
    setIsLoading(true);
    socket.emit('control:play', session.access_token, audio, data => {
      if (data.result) {
        showWarning(data.result);
      } else {
        showSuccess(`Добавлено: "${data.added?.title}"`);
      }
    });
  }, [setIsLoading, socket, session, showWarning, showSuccess]);

  const handleShikimoriSubmit = useCallback((username, countSongs) => {
    setIsLoading(true);
    socket.emit('control:shikimori', session.access_token, username, countSongs, data => {
      if (data.result) {
        showWarning(data.result);
      } else {
        showSuccess(`Добавлено: ${data.count} песен профиля "${data.login}"`);
      }
    });
  }, [setIsLoading, socket, session, showWarning, showSuccess]);

  const handleRadiosSubmit = useCallback((radio) => {
    setIsLoading(true);
    socket.emit('control:radio', session.access_token, radio, data => {
      if (data.result) {
        showWarning(data.result);
      } else {
        showSuccess(`Добавлено: "${data.info?.title}"`);
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
          <Paper elevation={2} className={classes.blockRoot}>
            <Typography variant="h4">Воздействия</Typography>
            <Divider orientation="horizontal" flexItem/>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              className={classes.blockContainer}
            >
              <Tooltip title="Перемешать">
                <span>
                  <LoadingButton
                    loading={isLoading}
                    variant="outlined"
                    color="primary"
                    value="shuffle"
                    size="large"
                    aria-label="Перемешать"
                    onClick={handleShuffleButton}
                    className={classes.loadingButton}
                  >
                    <Shuffle/>
                  </LoadingButton>
                </span>
              </Tooltip>
              <Tooltip title="Очистить">
                <span>
                  <LoadingButton
                    loading={isLoading}
                    variant="outlined"
                    color="primary"
                    value="clear"
                    size="large"
                    aria-label="Очистить"
                    onClick={handleClearButton}
                    className={classes.loadingButton}
                  >
                    <ClearAll/>
                  </LoadingButton>
                </span>
              </Tooltip>
            </Stack>
          </Paper>
          <Paper elevation={2} className={classes.blockRoot}>
            <Typography variant="h4">Инъекции</Typography>
            <Divider orientation="horizontal" flexItem/>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              className={classes.blockContainer}
            >
              <Youtube
                isLoading={isLoading}
                onSubmit={handleYoutubeSubmit}
              />
              <Shikimori
                isLoading={isLoading}
                onSubmit={handleShikimoriSubmit}
                setIsLoading={setIsLoading}
              />
              <Radio
                isLoading={isLoading}
                onSubmit={handleRadiosSubmit}
                setIsLoading={setIsLoading}
              />
            </Stack>
          </Paper>
        </Stack>
      </CardContent>
    </Card>
  );
});

Control.displayName = 'Control';
