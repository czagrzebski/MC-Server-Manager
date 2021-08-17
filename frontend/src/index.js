import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';

const theme = createTheme({
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

