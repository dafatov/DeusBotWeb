import {Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControlLabel, FormGroup, Typography} from '@mui/material';
import {memo, useCallback, useEffect, useState} from 'react';

export const SelectScopes = memo(({
  open,
  setOpen,
  scopes,
  onSubmit,
  patch,
  getDefaultScopes,
  isWhiteListPermission,
  userId,
}) => {
  const [checked, setChecked] = useState([]);

  useEffect(() => {
    setChecked(oldChecked => [
      ...oldChecked,
      ...getDefaultScopes(patch, userId).filter(item => !oldChecked.includes(item)),
    ]);
  }, [getDefaultScopes, patch, userId]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const handleChangeSelectAll = useCallback(() => {
    if (checked.length === scopes.length) {
      setChecked(getDefaultScopes(patch, userId));
    } else {
      setChecked(scopes);
    }
  }, [checked.length, getDefaultScopes, patch, scopes, userId]);

  const handleChange = useCallback((scope, isChecked) => {
    if (isChecked) {
      setChecked(oldChecked => [
        ...oldChecked,
        scope,
      ]);
    } else {
      setChecked(oldChecked => oldChecked.filter(item => item !== scope));
    }
  }, []);

  const handleSubmit = useCallback(() => {
    setOpen(false);
    onSubmit(userId, checked);
  }, [checked, onSubmit, setOpen, userId]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Добавление прав доступа</DialogTitle>
      <DialogContent dividers>
        <Typography color="primary" variant="body2">
          Учтите, что список в режиме {isWhiteListPermission(patch, userId)
          ? 'БЕЛОГО'
          : 'ЧЕРНОГО'} списка
        </Typography>
        <Divider/>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                onChange={() => handleChangeSelectAll()}
                checked={checked?.length === scopes?.length}
              />
            }
            label={checked?.length === scopes?.length
              ? 'Отвыбрать всех'
              : 'Выбрать всех'}
          />
          <Divider/>
          {scopes?.sort((a, b) => a.localeCompare(b))
            .map(scope =>
              <FormControlLabel
                key={scope}
                control={
                  <Checkbox
                    onChange={(_e, checked) => handleChange(scope, checked)}
                    checked={checked?.includes(scope)}
                    disabled={getDefaultScopes(patch, userId).includes(scope)}
                  />
                }
                label={scope}
              />)}
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Отмена</Button>
        <Button onClick={handleSubmit}>Добавить</Button>
      </DialogActions>
    </Dialog>
  );
});

SelectScopes.displayName = 'SelectScopes';
