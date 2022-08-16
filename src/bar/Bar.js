import {Login, Logout} from '@mui/icons-material';
import {AppBar, Avatar, Box, Button, Container, Divider, Fab, IconButton, ListItemIcon, Menu, MenuItem, Toolbar, Tooltip, Typography} from '@mui/material';
import {memo, useCallback, useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {getProfile} from '../api/profileApi';
import {redirect_url} from '../api/securityApi';
import {logout, useAuth} from '../security/AuthProvider';
import {useStyles} from './barStyles';

const auth_url_params = `client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${redirect_url}&response_type=code&scope=${process.env.REACT_APP_DISCORD_SCOPES}`;
const auth_url = `${process.env.REACT_APP_DISCORD_API_URL}/oauth2/authorize?${auth_url_params}`;

export const Bar = memo(() => {
  const classes = useStyles();
  const history = useHistory();
  const [logged] = useAuth();
  const [avatar, setAvatar] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [nickname, setNickname] = useState('');

  const handlePlayerPage = useCallback(() => {
    history.push('/player');
  }, [history]);

  const handleAdministrationPage = useCallback(() => {
    history.push('/administration');
  }, [history]);

  const handleMainPage = useCallback(() => {
    history.push('/');
  }, [history]);

  const handleLogin = useCallback(() => {
    window.location.assign(auth_url);
  }, []);

  const handleCloseAccountMenu = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);

  useEffect(() => {
    if (logged) {
      getProfile().then((p => {
        setAvatar(`${process.env.REACT_APP_DISCORD_CDN_URL}/avatars/${p.id}/${p.avatar}`);
        setNickname(p.username);
      }));
    }
  }, [logged]);

  return (
    <AppBar position="static">
      <Container maxWidth="x1">
        <Toolbar disableGutters>
          <Box className={classes.menu}>
            <Button
              key="main"
              onClick={handleMainPage}
            >DeuS</Button>
            <Button
              key="player"
              onClick={handlePlayerPage}
            >Плеер</Button>
            <Button
              key="administration"
              onClick={handleAdministrationPage}
            >Администрирование</Button>
          </Box>
          <Box className={classes.profile}>
            {logged
              ? <IconButton
                onClick={(e) => setAnchorEl(e.currentTarget)}
                aria-controls={Boolean(anchorEl)
                  ? 'account-menu'
                  : undefined}
                aria-haspopup="true"
                aria-expanded={Boolean(anchorEl)
                  ? 'true'
                  : undefined}
              >
                <Avatar src={avatar}/>
              </IconButton>
              : <Tooltip title={'Войти через Дискорд'}>
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
              horizontal: 'right',
              vertical: 'top',
            }}
            anchorOrigin={{
              horizontal: 'right',
              vertical: 'bottom',
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
});

Bar.displayName = 'Bar';
