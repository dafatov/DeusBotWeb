import {AppBar, Avatar, Box, Button, Container, Divider, Fab, IconButton, ListItemIcon, Menu, MenuItem, Toolbar, Tooltip, Typography} from "@mui/material";
import {useHistory} from "react-router-dom";
import {Login, Logout} from "@mui/icons-material";
import {logout, useAuth} from "../security/AuthProvider";
import {getProfile} from "../api/profileApi";
import {useEffect, useState} from "react";
import {redirect_url} from "../api/securityApi";

const auth_url = `${process.env.REACT_APP_DISCORD_API_URL}/oauth2/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${redirect_url}&response_type=code&scope=identify%20email`;

const Bar = () => {
  const history = useHistory();
  const [logged, session] = useAuth();
  const [avatar, setAvatar] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [nickname, setNickname] = useState("");

  const handlePlayerPage = () => {
    history.push("/player");
  }

  const handleMainPage = () => {
    history.push("/");
  }

  const handleLogin = () => {
    window.location.assign(auth_url);
  }

  const handleCloseAccountMenu = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (session) {
      getProfile(session).then((p =>
        setAvatar(`${process.env.REACT_APP_DISCORD_CDN_URL}/avatars/${p.id}/${p.avatar}`)));
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      getProfile(session).then(p => setNickname(p.username));
    }
  }, [session]);

  return (
    <AppBar position="static">
      <Container maxWidth="x1">
        <Toolbar disableGutters>
          <Box sx={{
            flexGrow: 1
          }}>
            <Button
              key="main"
              onClick={handleMainPage}
            >DeuS</Button>
            <Button
              key="player"
              onClick={handlePlayerPage}
            >Плеер</Button>
          </Box>
          <Box sx={{
            flexGrow: 0
          }}>
            {logged
              ?
              <IconButton
                onClick={(e) => setAnchorEl(e.currentTarget)}
                aria-controls={Boolean(anchorEl) ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
              >
                <Avatar src={avatar}/>
              </IconButton>
              :
              <Tooltip title={"Войти через Дискорд"}>
                <Fab
                  color="primary"
                  size="small"
                  onClick={handleLogin}
                >
                  <Login/>
                </Fab>
              </Tooltip>
            }
          </Box>
          <Menu
            id="account-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseAccountMenu}
            onClick={handleCloseAccountMenu}
            transformOrigin={{
              horizontal: "right",
              vertical: "top"
            }}
            anchorOrigin={{
              horizontal: "right",
              vertical: "bottom"
            }}
          >
            <MenuItem>
              <Typography>
                {nickname}
              </Typography>
            </MenuItem>
            <Divider/>
            <MenuItem onClick={() => logout()}>
              <ListItemIcon>
                <Logout/>
              </ListItemIcon>
              <Typography>Выйти</Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Bar;