import {LoadingButton} from '@mui/lab';
import {Button, Dialog, DialogActions, Tooltip} from '@mui/material';
import {memo, useCallback, useState} from 'react';
import {useStyles} from './injectionStyles';

export const Injection = memo(({
  children,
  titleTooltip,
  buttonIcon,
  onSubmit,
  isLoading,
}) => {
  const classes = useStyles();
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
          <Button onClick={handleClose}>Отмена</Button>
          <Button disabled={isLoading} onClick={handleSubmit}>Добавить</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
});

Injection.displayName = 'Injection';
