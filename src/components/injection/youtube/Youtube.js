import {Clear, YouTube} from '@mui/icons-material';
import {DialogContent, DialogContentText, DialogTitle, IconButton, InputBase, Paper} from '@mui/material';
import {memo, useRef, useState} from 'react';
import {Injection} from '../Injection';
import {useStyles} from './youtubeStyles';
import {useTranslation} from 'react-i18next';

export const Youtube = memo(({onSubmit, isLoading}) => {
  const classes = useStyles();
  const {t} = useTranslation();
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
      titleTooltip={t('web:app.injection.youtube.tooltip', 'YouTube')}
      buttonIcon={<YouTube/>}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    >
      <DialogTitle>{t('web:app.injection.youtube.title', 'Добавление композиций с youtube`а')}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('web:app.injection.youtube.description', 'В форму ниже можно вставить ссылку на композицию или плейлист или поисковой запрос. '
            + 'Приватные или удаленные плейлисты и песни не могут быть воспроизведены')}
        </DialogContentText>
        <Paper
          component="form"
          elevation={4}
          className={classes.inputRoot}
        >
          <InputBase
            id="input"
            label={t('web:app.injection.youtube.linkOrSearch', 'Ссылка или поисковой запрос')}
            value={field}
            inputRef={input}
            onChange={e => setField(e.target.value)}
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
