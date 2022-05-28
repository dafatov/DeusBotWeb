import {BrowserRouter} from "react-router-dom";
import {ThemeProvider} from "@mui/material/styles";
import theme from "../styles/theme";
import {SnackbarProvider} from "notistack";
import {SnackBarProviderProps} from "../utils/SnackBar";
import AppView from "./AppView";

function App() {
  return (
    <BrowserRouter basename="/">
      <ThemeProvider theme={theme}>
        <SnackbarProvider {...SnackBarProviderProps}>
          <AppView/>
        </SnackbarProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App;