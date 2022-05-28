import {BrowserRouter} from "react-router-dom";
import {ThemeProvider} from "@mui/material/styles";
import theme from "../styles/theme";
import {SnackbarProvider} from "notistack";
import {SnackBarProviderProps} from "../utils/SnackBar";
import NotFound from "../pages/not_found/NotFound";

function App() {
  return (
    <BrowserRouter basename="/">
      <ThemeProvider theme={theme}>
        <SnackbarProvider {...SnackBarProviderProps}>
          <NotFound/>
        </SnackbarProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App;