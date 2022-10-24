import {Button, Checkbox, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControlLabel, FormGroup, Typography} from '@mui/material';
import {memo, useCallback, useEffect, useState} from 'react';
import {useStyles} from './selectUsersStyles';
import {useTranslation} from 'react-i18next';

export const SelectUsers = memo(({
  open,
  setOpen,
  users,
  onSubmit,
  scopes = [],
  defaultCheckedUserIds = [],
}) => {
  const classes = useStyles();
  const {t} = useTranslation();
  const [checked, setChecked] = useState(defaultCheckedUserIds);

  useEffect(() => {
    setChecked(oldChanged => [
      ...oldChanged,
      ...defaultCheckedUserIds,
    ]);
  }, [defaultCheckedUserIds]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const handleChange = useCallback((userId, isChecked) => {
    if (isChecked) {
      setChecked(oldChecked => [
        ...oldChecked,
        userId,
      ]);
    } else {
      setChecked(oldChecked => oldChecked.filter(item => item !== userId));
    }
  }, [setChecked]);

  const handleChangeSelectAll = useCallback(() => {
    if (checked.length === Object.values(users).length) {
      setChecked(defaultCheckedUserIds);
    } else {
      setChecked(Object.values(users).map(user => user.id));
    }
  }, [checked.length, defaultCheckedUserIds, users]);

  const handleSubmit = useCallback(() => {
    setOpen(false);
    onSubmit(checked.filter(userId => !defaultCheckedUserIds.includes(userId)), scopes);
  }, [checked, defaultCheckedUserIds, onSubmit, scopes, setOpen]);

  if (!users) {
    return <></>;
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{t('web:app.audit.selectUsers.title', 'Добавление пользователей')}</DialogTitle>
      <DialogContent dividers>
        {scopes?.length > 0
          ? <>
            <Typography color="primary" variant="body2">
              {t(
                'web:app.audit.selectUsers.description',
                'Скопированы права доступа. Обратите внимание, что режим белового или черного списка НЕ копируется. Все добавленные пользователи будут добавляться с ними:',
              )}
            </Typography>
            <Divider/>
            {scopes.map(scope => (
              <Chip
                key={`${scope}`}
                variant="outlined"
                color="primary"
                label={`${scope}`}
                className={classes.scope}
              />
            ))}
            <Divider/>
          </>
          : <></>}
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                onChange={() => handleChangeSelectAll()}
                checked={checked.length === Object.values(users).length}
              />
            }
            label={checked.length === Object.values(users).length
              ? t('common:app.toUnselectAll', 'Отвыбрать всех')
              : t('common:app.toSelectAll', 'Выбрать всех')}
          />
          <Divider/>
          {Object.values(users)
            .sort((a, b) => a.username.localeCompare(b.username))
            .map(user =>
              <FormControlLabel
                key={user.id}
                control={
                  <Checkbox
                    onChange={e => handleChange(user.id, e.target.checked)}
                    checked={checked.includes(user.id)}
                    disabled={defaultCheckedUserIds.includes(user.id)}
                  />
                }
                label={user.username}
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

SelectUsers.displayName = 'SelectUsers';
