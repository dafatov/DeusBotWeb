import {useSocket} from "../../../security/SocketProvider";
import {useEffect, useState} from "react";
import {Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, Select, Tooltip} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {Radio} from "@mui/icons-material";

const Radios = ({onSubmit, isLoading, setIsLoading}) => {
  const socket = useSocket();
  const [open, setOpen] = useState(false);
  const [radios, setRadios] = useState(null);
  const [radio, setRadio] = useState("");

  useEffect(() => {
    setIsLoading(true);
    if (socket) {
      socket.emit("control:getRadios", data => {
        setRadios(data.radios);
        setIsLoading(false);
      })
    }
    return () => setRadios(null)
  }, [setIsLoading, socket])

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const handleSubmit = () => {
    setOpen(false);
    onSubmit(radio);
  }

  const handleKeyboard = e => {
    e.preventDefault();
    if (e.key === "Enter") {
      handleSubmit();
    }
  }

  return (
    <div onKeyPress={handleKeyboard}>
      <Tooltip title="Radios">
        <span>
          <LoadingButton
            loading={isLoading}
            variant="outlined"
            color="primary"
            value="radio"
            size="large"
            aria-label="Radio"
            onClick={handleOpen}
            sx={{padding: "15px", minWidth: "56px"}}
          >
            <Radio/>
          </LoadingButton>
        </span>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Добавление потоковой радиостанции</DialogTitle>
        <DialogContent>
          <DialogContentText style={{marginBottom: '16px'}}>
            В форме ниже можно выбрать радиостанцию
          </DialogContentText>
          {radios
            ?
            <Select
              value={radio}
              label="Радиостанция"
              autoWidth
              onChange={e => setRadio(e.target.value)}
              sx={{
                minWidth: "100px"
              }}
            >
              {radios.sort().map(radio => (
                <MenuItem key={radio} value={radio}>{radio}</MenuItem>
              ))}
            </Select>
            :
            <CircularProgress/>
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Отмена</Button>
          <Button disabled={isLoading} onClick={handleSubmit}>Добавить</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Radios;