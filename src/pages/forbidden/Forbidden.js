import {Button, Card, CardContent, Stack, Typography} from '@mui/material';
import {memo, useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router-dom';

export const Forbidden = memo(() => {
  const {t} = useTranslation();
  const history = useHistory();

  const handleToMain = useCallback(() => {
    history.push('/');
  }, [history]);

  return (
    <Card>
      <CardContent>
        <Stack
          direction="column"
          spacing={2}
        >
          <Typography align="center" variant="h1">{t('web:app.forbidden.title', 'Ошибка 403')}</Typography>
          <Typography>{t(
            'web:app.forbidden.description', 'Страница не доступна текущему пользователю. Для получения доступа обратитесь к администратору')}</Typography>
          <Button onClick={handleToMain}>{t('common:app.toMain', 'На главную')}</Button>
        </Stack>
      </CardContent>
    </Card>
  );
});

Forbidden.displayName = 'Forbidden';
