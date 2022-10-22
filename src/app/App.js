import {Suspense, memo} from 'react';
import {AppView} from './AppView';
import {BrowserRouter} from 'react-router-dom';
import {CircularProgress} from '@mui/material';
import {SnackBarProviderProps} from '../utils/snackBar';
import {SnackbarProvider} from 'notistack';
import {SocketProvider} from '../security/SocketProvider';
import {ThemeProvider} from '@mui/material/styles';
import {theme} from '../styles/theme';

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
