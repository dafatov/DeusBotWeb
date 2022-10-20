import {CircularProgress, DialogContent, DialogContentText, DialogTitle, MenuItem, Select} from '@mui/material';
import {memo, useCallback, useEffect, useState} from 'react';
import {Injection} from '../Injection';
import {Radio as RadioIcon} from '@mui/icons-material';
import {useSocket} from '../../../security/SocketProvider';
import {useStyles} from './radioStyles';
import {useTranslation} from 'react-i18next';

export const Radio = memo(({onSubmit, isLoading, setIsLoading}) => {
  const classes = useStyles();
  const {t} = useTranslation();
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
      titleTooltip={t('web:app.injection.radio.tooltip', 'Радио')}
      buttonIcon={<RadioIcon/>}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    >
      <DialogTitle>{t('web:app.injection.radio.title', 'Добавление потоковой радиостанции')}</DialogTitle>
      <DialogContent>
        <DialogContentText className={classes.dialogText}>
          {t('web:app.injection.radio.description', 'В форме ниже можно выбрать радиостанцию')}
        </DialogContentText>
        {radios
          ? <Select
            value={radio}
            label={t('web:app.injection.radio.station', 'Радиостанция')}
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
