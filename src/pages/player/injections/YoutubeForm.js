import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, InputBase, Paper, Tooltip} from "@mui/material";
import {useRef, useState} from "react";
import {LoadingButton} from "@mui/lab";
import {Clear, YouTube} from "@mui/icons-material";

const YoutubeForm = ({onSubmit, isLoading}) => {
  const [open, setOpen] = useState(false);
  const [field, setField] = useState("");
  const input = useRef(null);

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const handleClear = () => {
    setField("");
    input.current?.focus();
  };

  const handleSubmit = () => {
    setOpen(false);
    onSubmit(field);
  };

  const handleKeyboard = e => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  }

  return (
    <div onKeyDown={handleKeyboard}>
      <Tooltip title="Youtube">
        <span>
          <LoadingButton
            loading={isLoading}
            variant="outlined"
            color="primary"
            value="youtube"
            size="large"
            aria-label="Youtube"
            onClick={handleOpen}
            sx={{padding: "15px", minWidth: "56px"}}
          >
            <YouTube/>
          </LoadingButton>
        </span>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Добавление композиций с youtube`а</DialogTitle>
        <DialogContent>
          <DialogContentText>
            В форму ниже можно вставить ссылку на композицию или плейлист или поисковой запрос. Приватные или удаленные плейлисты и песни не могут быть
            воспроизведены
          </DialogContentText>
          <Paper
            component="form"
            elevation={4}
            sx={{
              paddingLeft: 1,
              paddingTop: 0.5,
              paddingBottom: 0.5,
              display: "flex",
              alignItems: "center",
              marginTop: 2
            }}
          >
            <InputBase
              id="input"
              label="Ссылка или поисковой запрос"
              value={field}
              inputRef={input}
              onChange={(e) => setField(e.target.value)}
              autoFocus
              fullWidth
            />
            <IconButton
              onClick={handleClear}
              sx={{
                padding: 1.5
              }}
            >
              <Clear/>
            </IconButton>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Отмена</Button>
          <Button onClick={handleSubmit}>Добавить</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default YoutubeForm;