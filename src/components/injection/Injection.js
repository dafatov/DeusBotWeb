import {Button, Dialog, DialogActions, Tooltip} from '@mui/material';
import {memo, useCallback, useState} from 'react';
import {LoadingButton} from '@mui/lab';
import {useStyles} from './injectionStyles';
import {useTranslation} from 'react-i18next';

export const Injection = memo(({
  children,
  titleTooltip,
  buttonIcon,
  onSubmit,
  isLoading,
}) => {
  const classes = useStyles();
  const {t} = useTranslation();
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => setOpen(true), [setOpen]);

  const handleClose = useCallback(() => setOpen(false), [setOpen]);

  const handleSubmit = useCallback(() => {
    setOpen(false);
    onSubmit();
  }, [setOpen, onSubmit]);

  const handleKeyboard = useCallback(e => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  }, [handleSubmit]);

  return (
    <div onKeyDown={handleKeyboard}>
      <Tooltip title={titleTooltip}>
        <span>
          <LoadingButton
            loading={isLoading}
            variant="outlined"
            color="primary"
            value={titleTooltip}
            size="large"
            aria-label={titleTooltip}
            onClick={handleOpen}
            className={classes.loadingButton}
          >
            {buttonIcon}
          </LoadingButton>
        </span>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        {children}
        <DialogActions>
          <Button onClick={handleClose}>{t('common:app.cancel', 'Отмена')}</Button>
          <Button disabled={isLoading} onClick={handleSubmit}>{t('common:app.add', 'Добавить')}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
});

Injection.displayName = 'Injection';
