import {Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControlLabel, FormGroup, Typography} from '@mui/material';
import {memo, useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';

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
  const {t} = useTranslation();
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
      <DialogTitle>{t('web:app.audit.selectScopes.title', 'Добавление прав доступа')}</DialogTitle>
      <DialogContent dividers>
        <Typography color="primary" variant="body2">
          {t('web:app.audit.selectScopes.description', 'Учтите, что список в режиме {{mode}} списка', {
            mode: isWhiteListPermission(patch, userId)
              ? t('common:app.white', 'БЕЛОГО')
              : t('common:app.black', 'ЧЕРНОГО'),
          })}
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
              ? t('common:app.toUnselect', 'Отвыбрать всех')
              : t('common:app.toSelect', 'Выбрать всех')}
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
        <Button onClick={handleClose}>{t('common:app.cancel', 'Отмена')}</Button>
        <Button onClick={handleSubmit}>{t('common:app.add', 'Добавить')}</Button>
      </DialogActions>
    </Dialog>
  );
});

SelectScopes.displayName = 'SelectScopes';
