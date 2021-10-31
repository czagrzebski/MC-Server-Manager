import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { ThemeProvider, StyledEngineProvider, createTheme, adaptV4Theme } from "@mui/material/styles";
import { blue } from "@mui/material/colors";
import { Provider } from "react-redux";
import store from "./app/store";

const theme = createTheme(adaptV4Theme({
  palette: {
    mode: "dark",
    primary: blue,
  },
}));

ReactDOM.render(
  <Provider store={store}>
    <div>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </StyledEngineProvider>
    </div>
  </Provider>,
  document.getElementById("root")
);
