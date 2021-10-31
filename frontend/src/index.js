import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { ThemeProvider, StyledEngineProvider, createTheme, adaptV4Theme } from "@mui/material/styles";
import { Provider } from "react-redux";
import store from "./app/store";
import { CssBaseline } from "@mui/material";

const theme = createTheme(adaptV4Theme({
  palette: {
    mode: "dark",
    primary: {
      main: "#2a313d"
    },
    background: {
      default: "#1D222A"
    }
  },
}));

ReactDOM.render(
  <Provider store={store}>
    <div>
      <StyledEngineProvider injectFirst>
        <CssBaseline />
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </StyledEngineProvider>
    </div>
  </Provider>,
  document.getElementById("root")
);
