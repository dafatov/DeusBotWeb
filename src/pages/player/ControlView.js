import {Card, CardContent, Divider, Paper, Stack, Tooltip, Typography} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {ClearAll, Shuffle} from "@mui/icons-material";
import {useSnackBar} from "../../utils/SnackBar";
import {useAuth} from "../../security/AuthProvider";
import {useSocket} from "../../security/SocketProvider";
import YoutubeForm from "./injections/YoutubeForm";
import Shikimori from "./injections/Shikimori";
import Radios from "./injections/Radios";

const ControlView = ({isLoading, setIsLoading}) => {
  const {showSuccess, showWarning} = useSnackBar();
  const [, session] = useAuth();
  const socket = useSocket();

  const handleShuffleButton = () => {
    setIsLoading(true);
    socket.emit("control:shuffle", session.access_token, data => {
      if (data.result) {
        showWarning(data.result);
      } else {
        showSuccess("Успешно перемешана очередь");
      }
    });
  }

  const handleClearButton = () => {
    setIsLoading(true);
    socket.emit("control:clear", session.access_token, data => {
      if (data.result) {
        showWarning(data.result);
      } else {
        showSuccess("Успешно очищена очередь");
      }
    });
  }

  const handleYoutubeSubmit = (audio) => {
    setIsLoading(true);
    socket.emit("control:play", session.access_token, audio, data => {
      if (data.result) {
        showWarning(data.result);
      } else {
        showSuccess(`Добавлено: "${data.Added?.title}"`)
      }
    });
  }

  const handleShikimoriSubmit = (username, countSongs) => {
    setIsLoading(true);
    socket.emit("control:shikimori", session.access_token, username, countSongs, data => {
      if (data.result) {
        showWarning(data.result);
      } else {
        showSuccess(`Добавлено: ${data.count} песен профиля "${data.login}"`)
      }
    });
  }

  const handleRadiosSubmit = (radio) => {
    setIsLoading(true);
    socket.emit("control:radio", session.access_token, radio, data => {
      if (data.result) {
        showWarning(data.result);
      } else {
        showSuccess(`Добавлено: "${data.info?.title}"`)
      }
    });
  }

  return (
    <Card>
      <CardContent>
        <Stack
          direction="column"
          alignItems="center"
          spacing={2}
        >
          <Paper elevation={2} sx={{padding: 1, width: "100%"}}>
            <Typography variant="h4">Воздействия</Typography>
            <Divider orientation="horizontal" flexItem/>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{
                marginTop: 1.5
              }}
            >
              <Tooltip title="Перемешать">
                <span>
                  <LoadingButton
                    loading={isLoading}
                    variant="outlined"
                    color="primary"
                    value="shuffle"
                    size="large"
                    aria-label="Перемешать"
                    onClick={handleShuffleButton}
                    sx={{padding: "15px", minWidth: "56px"}}
                  >
                    <Shuffle/>
                  </LoadingButton>
                </span>
              </Tooltip>
              <Tooltip title="Очистить">
                <span>
                  <LoadingButton
                    loading={isLoading}
                    variant="outlined"
                    color="primary"
                    value="clear"
                    size="large"
                    aria-label="Очистить"
                    onClick={handleClearButton}
                    sx={{padding: "15px", minWidth: "56px"}}
                  >
                    <ClearAll/>
                  </LoadingButton>
                </span>
              </Tooltip>
            </Stack>
          </Paper>
          <Paper elevation={2} sx={{padding: 1, width: "100%"}}>
            <Typography variant="h4">Инъекции</Typography>
            <Divider orientation="horizontal" flexItem/>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{
                marginTop: 1.5
              }}
            >
              <YoutubeForm
                isLoading={isLoading}
                onSubmit={handleYoutubeSubmit}
              />
              <Shikimori
                isLoading={isLoading}
                onSubmit={handleShikimoriSubmit}
                setIsLoading={setIsLoading}
              />
              <Radios
                isLoading={isLoading}
                onSubmit={handleRadiosSubmit}
                setIsLoading={setIsLoading}
              />
            </Stack>
          </Paper>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ControlView;