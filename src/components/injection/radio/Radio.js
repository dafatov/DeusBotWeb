import {Radio as RadioIcon} from '@mui/icons-material';
import {CircularProgress, DialogContent, DialogContentText, DialogTitle, MenuItem, Select} from '@mui/material';
import {memo, useCallback, useEffect, useState} from 'react';
import {useSocket} from '../../../security/SocketProvider';
import {Injection} from '../Injection';
import {useStyles} from './radioStyles';

export const Radio = memo(({onSubmit, isLoading, setIsLoading}) => {
  const classes = useStyles();
  const socket = useSocket();
  const [radios, setRadios] = useState(null);
  const [radio, setRadio] = useState('');

  useEffect(() => {
    setIsLoading(true);
    if (socket) {
      socket.emit('control:getRadios', data => {
        setRadios(data.radios);
        setIsLoading(false);
      });
    }
    return () => setRadios(null);
  }, [setIsLoading, socket]);

  const handleSubmit = useCallback(() => {
    onSubmit(radio);
  }, [onSubmit, radio]);

  return (
    <Injection
      titleTooltip="Radio"
      buttonIcon={<RadioIcon/>}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    >
      <DialogTitle>Добавление потоковой радиостанции</DialogTitle>
      <DialogContent>
        <DialogContentText className={classes.dialogText}>
          В форме ниже можно выбрать радиостанцию
        </DialogContentText>
        {radios
          ? <Select
            value={radio}
            label="Радиостанция"
            autoWidth
            onChange={e => setRadio(e.target.value)}
            className={classes.select}
          >
            {radios.sort().map(radio => (
              <MenuItem key={radio} value={radio}>{radio}</MenuItem>
            ))}
          </Select>
          : <CircularProgress/>
        }
      </DialogContent>
    </Injection>
  );
});

Radio.displayName = 'Radio';
