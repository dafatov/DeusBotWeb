import {CircularProgress, DialogContent, DialogContentText, DialogTitle, MenuItem, Select, Slider, Stack, SvgIcon, TextField} from '@mui/material';
import {memo, useCallback, useEffect, useState} from 'react';
import {ReactComponent as ShikimoriIcon} from '../../../assets/icons/shikimori.svg';
import {useSocket} from '../../../security/SocketProvider';
import {Injection} from '../Injection';
import {useStyles} from './shikimoriStyles';

export const Shikimori = memo(({onSubmit, isLoading, setIsLoading}) => {
  const classes = useStyles();
  const socket = useSocket();
  const [username, setUsername] = useState('');
  const [countSongs, setCountSongs] = useState(1);
  const [profiles, setProfiles] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    if (socket) {
      socket.emit('control:getShikimoriUsers', data => {
        setProfiles(data.profiles);
        setIsLoading(false);
      });
    }
    return () => setProfiles(null);
  }, [setIsLoading, socket]);

  const handleSubmit = useCallback(() => {
    onSubmit(username, countSongs);
  }, [onSubmit, username, countSongs]);

  return (
    <Injection
      titleTooltip="Shikimori"
      buttonIcon={<SvgIcon component={ShikimoriIcon}/>}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    >
      <DialogTitle>Добавление op/ed из листа shikimori</DialogTitle>
      <DialogContent>
        <DialogContentText className={classes.dialogText}>
          В форме ниже можно выбрать профиль shikimori и количество случайных генерируемых композиций
        </DialogContentText>
        {profiles
          ? <Select
            value={username}
            label="Пользователь"
            autoWidth
            onChange={e => setUsername(e.target.value)}
            className={classes.select}
          >
            {profiles.map(p => (
              <MenuItem key={p} value={p}>{p}</MenuItem>
            ))}
          </Select>
          : <CircularProgress/>
        }
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Slider
            value={countSongs}
            onChange={e => setCountSongs(e.target.value)}
            max={100}
            min={1}
            defaultValue={1}
          />
          <TextField
            value={countSongs}
            onChange={e => setCountSongs(parseInt(e.target.value))}
            inputProps={{
              step: 9,
              min: 1,
              max: 100,
              type: 'number',
            }}
          />
        </Stack>
      </DialogContent>
    </Injection>
  );
});

Shikimori.displayName = 'Shikimori';
