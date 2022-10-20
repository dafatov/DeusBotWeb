import {CircularProgress} from '@mui/material';
import {ThemeProvider} from '@mui/material/styles';
import {SnackbarProvider} from 'notistack';
import {memo, Suspense} from 'react';
import {BrowserRouter} from 'react-router-dom';
import {SocketProvider} from '../security/SocketProvider';
import {theme} from '../styles/theme';
import {SnackBarProviderProps} from '../utils/snackBar';
import {AppView} from './AppView';

export const App = memo(() => {
  return (
    <BrowserRouter basename="/">
      <ThemeProvider theme={theme}>
        <Suspense fallback={<CircularProgress/>}>
          <SnackbarProvider {...SnackBarProviderProps}>
            <SocketProvider>
              <AppView/>
            </SocketProvider>
          </SnackbarProvider>
        </Suspense>
      </ThemeProvider>
    </BrowserRouter>
  );
});

App.displayName = 'App';
