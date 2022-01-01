import AppView from "./AppView";
import {BrowserRouter} from "react-router-dom";
import {ThemeProvider} from "@mui/material/styles";
import theme from "../styles/theme";
import {SnackbarProvider} from "notistack";
import {SnackBarProviderProps} from "../utils/SnackBar";
import {SocketProvider} from "../security/SocketProvider";

function App() {
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
}

export default App;
