import {Button, Card, CardContent, Stack, Typography} from '@mui/material';
import {memo, useCallback} from 'react';
import {useHistory} from 'react-router-dom';

export const Forbidden = memo(() => {
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
          <Typography align="center" variant="h1">Ошибка 403</Typography>
          <Typography>Страница не доступна текущему пользователю. Для получения доступа обратитесь к администратору</Typography>
          <Button onClick={handleToMain}>На главную</Button>
        </Stack>
      </CardContent>
    </Card>
  );
});

Forbidden.displayName = 'Forbidden';
