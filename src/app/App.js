import {ThemeProvider} from "@mui/material/styles";
import theme from "../styles/theme";
import {SnackbarProvider} from "notistack";
import {SnackBarProviderProps} from "../utils/SnackBar";
import {SocketProvider} from "../security/SocketProvider";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider {...SnackBarProviderProps}>
        <SocketProvider>
          <div className="App">
            <header className="App-header">
              <p>
                Edit <code>src/App.js</code> and save to reload.
              </p>
              <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn React
              </a>
            </header>
          </div>
        </SocketProvider>
      </SnackbarProvider>
      </ThemeProvider>
  );
}

export default App;