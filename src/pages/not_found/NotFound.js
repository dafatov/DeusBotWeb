import {Button, Card, CardContent, Stack, Typography} from "@mui/material";
import {useHistory, useLocation} from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const history = useHistory();

  function handleToMain() {
    history.push("/");
  }

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
};

export default NotFound;