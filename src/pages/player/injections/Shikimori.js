import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Select,
  Slider,
  Stack,
  SvgIcon,
  TextField,
  Tooltip
} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {ReactComponent as ShikimoriIcon} from "../../../assets/icons/shikimori.svg";
import {useEffect, useState} from "react";
import {useSocket} from "../../../security/SocketProvider";

const Shikimori = ({onSubmit, isLoading, setIsLoading}) => {
  const socket = useSocket();
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [countSongs, setCountSongs] = useState(1);
  const [profiles, setProfiles] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    if (socket) {
      socket.emit("control:getShikimoriUsers", data => {
        setProfiles(data.profiles);
        setIsLoading(false);
      })
    }
    return () => setProfiles(null)
  }, [setIsLoading, socket])

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const handleSubmit = () => {
    setOpen(false);
    onSubmit(username, countSongs);
  }

  const handleKeyboard = e => {
    e.preventDefault();
    if (e.key === "Enter") {
      handleSubmit();
    }
  }

  return (
    <div onKeyPress={handleKeyboard}>
      <Tooltip title="Shikimori">
        <span>
          <LoadingButton
            loading={isLoading}
            variant="outlined"
            color="primary"
            value="shikimori"
            size="large"
            aria-label="Shikimori"
            onClick={handleOpen}
            sx={{padding: "15px", minWidth: "56px"}}
          >
            <SvgIcon component={ShikimoriIcon}/>
          </LoadingButton>
        </span>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Добавление op/ed из листа шикимори</DialogTitle>
        <DialogContent>
          <DialogContentText style={{marginBottom: '16px'}}>
            В форме ниже можно выбрать профиль shikimori и количество случайных генерируемых композиций
          </DialogContentText>
          {profiles
            ?
            <Select
              value={username}
              label="Пользователь"
              autoWidth
              onChange={e => setUsername(e.target.value)}
              sx={{
                minWidth: "100px"
              }}
            >
              {profiles.map(p => (
                <MenuItem key={p} value={p}>{p}</MenuItem>
              ))}
            </Select>
            :
            <CircularProgress/>
          }
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <Slider
              value={countSongs}
              onChange={e => setCountSongs(e.target.value)}
              max={100}
              min={1}
              defaultValue={1}
            />
            <TextField
              value={countSongs}
              onChange={e => setCountSongs(e.target.value)}
              inputProps={{
                step: 9,
                min: 1,
                max: 100,
                type: "number"
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Отмена</Button>
          <Button disabled={isLoading} onClick={handleSubmit}>Добавить</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Shikimori;