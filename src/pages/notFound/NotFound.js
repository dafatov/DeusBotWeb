import {Button, Card, CardContent, Stack, Typography} from '@mui/material';
import {memo, useCallback} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

export const NotFound = memo(() => {
  const {t} = useTranslation();
  const location = useLocation();
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
          <Typography align="center" variant="h1">{t('web:app.notFound.title', 'Ошибка 404')}</Typography>
          <Typography>{t('web:app.notFound.description', 'Страницы с адресом {{location.pathname}} не существует', {path: location.pathname})}</Typography>
          <Button onClick={handleToMain}>{t('common:app.toMain', 'На главную')}</Button>
        </Stack>
      </CardContent>
    </Card>
  );
});

NotFound.displayName = 'NotFound';
