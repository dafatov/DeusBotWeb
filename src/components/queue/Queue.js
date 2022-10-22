import {Card, CardContent, Typography} from '@mui/material';
import {motion} from 'framer-motion';
import {memo, useCallback} from 'react';
import ReactDragListView from 'react-drag-listview';
import {useTranslation} from 'react-i18next';
import {Scrollbar} from 'react-scrollbars-custom';
import {useAuth} from '../../security/AuthProvider';
import {useSocket} from '../../security/SocketProvider';
import {useSnackBar} from '../../utils/snackBar';
import {QueueElement} from './queueElement/QueueElement';
import {useStyles} from './queueStyles';

//TODO отключать перемещение элементов при загрузке
//TODO отключать таймер при потере связи с сервером (а лучше вообще это как-то обрабатывать)
//TODO добавить локальное предсказание ответа сервера (просто делать то что и сервер до его ответа)
export const Queue = memo(({songs, isLoading, setIsLoading}) => {
  const classes = useStyles();
  const {t} = useTranslation();
  const {showSuccess, showWarning} = useSnackBar();
  const [, session] = useAuth();
  const socket = useSocket();

  const handleRemove = useCallback(index => {
    setIsLoading(true);
    socket.emit('queue:remove', session.access_token, index, data => {
      if (data.result) {
        showWarning(data.result);
      } else {
        showSuccess(t('web:app.nowPlaying.success.skipped', 'Успешно удалена композиция: "{{title}}"'), {title: data.isRemoved.title});
      }
    });
  }, [setIsLoading, socket, session, showSuccess, showWarning]);

  const handleDragEnd = useCallback((from, to) => {
    setIsLoading(true);
    socket.emit('queue:move', session.access_token, from, to, data => {
      if (data.result) {
        showWarning(data.result);
      } else {
        showSuccess(t('web:app.nowPlaying.success.skipped', 'Успешно перемещена на "{{target}}" позицию композиция: "{{title}}"',
          {target: data.newIndex + 1, title: data.isMoved.title},
        ));
      }
    });
  }, [setIsLoading, socket, session, showSuccess, showWarning]);

  return (
    <Card>
      <CardContent>
        {songs
          ? <Scrollbar
            noScrollX
            // TODO нет пока другого способа передать стили в этот компонент
            style={{
              width: '100%',
              height: '80vh',
            }}
          >
            <ReactDragListView
              onDragEnd={handleDragEnd}
              nodeSelector="li"
              handleSelector="li"
            >
              {songs.map((song, index) => (
                <li className={classes.song} key={index}>
                  <QueueElement key={song.id} index={index} length={songs.length} element={song} loading={isLoading} onRemove={handleRemove}/>
                </li>
              ))}
            </ReactDragListView>
          </Scrollbar>
          : <motion.div
            animate={{backgroundColor: ['#FFFF50ff', '#FFFF5000', '#FFFF50ff']}}
            transition={{
              repeat: Infinity,
              duration: 2,
            }}
            className={classes.loading}
          >
            <Typography
              color="primary"
              variant="h4"
              display="flex"
              justifyContent="center"
              alignContent="center"
            >
              {t('web:app.queue.loading', 'Идет загрузка...')}
            </Typography>
          </motion.div>
        }
      </CardContent>
    </Card>
  );
});

Queue.displayName = 'Queue';
