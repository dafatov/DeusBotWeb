import {Card, CardContent, Divider, Paper, Stack, Tooltip, Typography} from '@mui/material';
import {ClearAll, Shuffle} from '@mui/icons-material';
import {memo, useCallback} from 'react';
import {LoadingButton} from '@mui/lab';
import {Radio} from '../injection/radio/Radio';
import {Shikimori} from '../injection/shikimori/Shikimori';
import {Youtube} from '../injection/youtube/Youtube';
import {useAuth} from '../../security/AuthProvider';
import {useSnackBar} from '../../utils/snackBar';
import {useSocket} from '../../security/SocketProvider';
import {useStyles} from './controlStyles';
import {useTranslation} from 'react-i18next';

export const Control = memo(({isLoading, setIsLoading}) => {
  const classes = useStyles();
  const {t} = useTranslation();
  const {showSuccess, showWarning} = useSnackBar();
  const [, session] = useAuth();
  const socket = useSocket();

  const handleShuffleButton = useCallback(() => {
    setIsLoading(true);
    socket.emit('control:shuffle', session.access_token, data => {
      if (data.result) {
        showWarning(data.result);
      } else {
        showSuccess(t('web:app.control.success.shuffled', 'Успешно перемешана очередь'));
      }
    });
  }, [setIsLoading, socket, session, showWarning, showSuccess]);

  const handleClearButton = useCallback(() => {
    setIsLoading(true);
    socket.emit('control:clear', session.access_token, data => {
      if (data.result) {
        showWarning(data.result);
      } else {
        showSuccess(t('web:app.control.success.cleared', 'Успешно очищена очередь'));
      }
    });
  }, [setIsLoading, socket, session, showWarning, showSuccess]);

  const handleYoutubeSubmit = useCallback(audio => {
    setIsLoading(true);
    socket.emit('control:play', session.access_token, audio, data => {
      if (data.result) {
        showWarning(data.result);
      } else {
        showSuccess(t('web:app.control.success.played.youtube', 'Добавлено: "{{title}}"', {title: data.added?.title}));
      }
    });
  }, [setIsLoading, socket, session, showWarning, showSuccess]);

  const handleShikimoriSubmit = useCallback((username, countSongs) => {
    setIsLoading(true);
    socket.emit('control:shikimori', session.access_token, username, countSongs, data => {
      if (data.result) {
        showWarning(data.result);
      } else {
        showSuccess(
          t('web:app.control.success.played.skikimori', 'Добавлено: {{data.count}} песен профиля "{{data.login}}"', {count: data.count, login: data.login}));
      }
    });
  }, [setIsLoading, socket, session, showWarning, showSuccess]);

  const handleRadiosSubmit = useCallback(radio => {
    setIsLoading(true);
    socket.emit('control:radio', session.access_token, radio, data => {
      if (data.result) {
        showWarning(data.result);
      } else {
        showSuccess(t('web:app.control.success.played.radios', 'Добавлено: "{{data.info?.title}}"', {title: data.info?.title}));
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
            <Typography variant="h4">{t('web:app.control.header.impacts', 'Воздействия')}</Typography>
            <Divider orientation="horizontal" flexItem/>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              className={classes.blockContainer}
            >
              <Tooltip title={t('common:app.shuffle', 'Перемешать')}>
                <span>
                  <LoadingButton
                    loading={isLoading}
                    variant="outlined"
                    color="primary"
                    value="shuffle"
                    size="large"
                    aria-label={t('common:app.shuffle', 'Перемешать')}
                    onClick={handleShuffleButton}
                    className={classes.loadingButton}
                  >
                    <Shuffle/>
                  </LoadingButton>
                </span>
              </Tooltip>
              <Tooltip title={t('common:app.clear', 'Очистить')}>
                <span>
                  <LoadingButton
                    loading={isLoading}
                    variant="outlined"
                    color="primary"
                    value="clear"
                    size="large"
                    aria-label={t('common:app.clear', 'Очистить')}
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
            <Typography variant="h4">{t('web:app.control.header.injections', 'Инъекции')}</Typography>
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
