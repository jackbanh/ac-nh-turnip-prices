import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import indigo from '@material-ui/core/colors/indigo';

import '../../node_modules/react-vis/dist/style.css';

import App from './App';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: indigo['200'],
    },
    secondary: {
      main: green.A100,
    },
  },
  typography: {
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
    h6: {
      fontSize: '1rem',
      fontWeight: 400,
    },
  },
});

/* global document */
ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>,
  document.getElementById('root'),
);
