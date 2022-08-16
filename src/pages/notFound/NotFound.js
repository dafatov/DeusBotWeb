import {Button, Card, CardContent, Stack, Typography} from '@mui/material';
import {memo, useCallback} from 'react';
import {useHistory, useLocation} from 'react-router-dom';

export const NotFound = memo(() => {
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
          <Typography align="center" variant="h1">Ошибка 404</Typography>
          <Typography>Страницы с адресом {location.pathname} не существует</Typography>
          <Button onClick={handleToMain}>На главную</Button>
        </Stack>
      </CardContent>
    </Card>
  );
});

NotFound.displayName = 'NotFound';
