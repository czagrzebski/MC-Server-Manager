import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { ThemeProvider, createTheme } from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";
import { Provider } from "react-redux";
import store from "./app/store";

//MUI Theming

const theme = createTheme({
  palette: {
    type: "dark",
    primary: blue,
  },
});

ReactDOM.render(
  <Provider store={store}>
    <div>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </div>
  </Provider>,
  document.getElementById("root")
);
