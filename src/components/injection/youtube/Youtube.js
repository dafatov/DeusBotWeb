import {Clear, YouTube} from '@mui/icons-material';
import {DialogContent, DialogContentText, DialogTitle, IconButton, InputBase, Paper} from '@mui/material';
import {memo, useRef, useState} from 'react';
import {Injection} from '../Injection';
import {useStyles} from './youtubeStyles';

export const Youtube = memo(({onSubmit, isLoading}) => {
  const classes = useStyles();
  const [field, setField] = useState('');
  const input = useRef(null);

  const handleClear = () => {
    setField('');
    input.current?.focus();
  };

  const handleSubmit = () => {
    onSubmit(field);
  };

  return (
    <Injection
      titleTooltip="YouTube"
      buttonIcon={<YouTube/>}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    >
      <DialogTitle>Добавление композиций с youtube`а</DialogTitle>
      <DialogContent>
        <DialogContentText>
          В форму ниже можно вставить ссылку на композицию или плейлист или поисковой запрос. Приватные или удаленные плейлисты и песни не могут быть
          воспроизведены
        </DialogContentText>
        <Paper
          component="form"
          elevation={4}
          className={classes.inputRoot}
        >
          <InputBase
            id="input"
            label="Ссылка или поисковой запрос"
            value={field}
            inputRef={input}
            onChange={(e) => setField(e.target.value)}
            autoFocus
            fullWidth
          />
          <IconButton
            onClick={handleClear}
            className={classes.clear}
          >
            <Clear/>
          </IconButton>
        </Paper>
      </DialogContent>
    </Injection>
  );
});

Youtube.displayName = 'YouTube';
