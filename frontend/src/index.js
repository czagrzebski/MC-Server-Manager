import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: blue,
  }
});

ReactDOM.render(
  <div>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
    </div>,
  document.getElementById('root')
);

