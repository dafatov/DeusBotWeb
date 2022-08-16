import {ThemeProvider} from '@mui/material/styles';
import {SnackbarProvider} from 'notistack';
import {memo} from 'react';
import {BrowserRouter} from 'react-router-dom';
import {SocketProvider} from '../security/SocketProvider';
import {theme} from '../styles/theme';
import {SnackBarProviderProps} from '../utils/snackBar';
import {AppView} from './AppView';

export const App = memo(() => {
  return (
    <BrowserRouter basename="/">
      <ThemeProvider theme={theme}>
        <SnackbarProvider {...SnackBarProviderProps}>
          <SocketProvider>
            <AppView/>
          </SocketProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
});

App.displayName = 'App';
