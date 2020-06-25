import React from 'react';

import './global.css';

import Routes from './routes';

import { ThemeProvider } from '@material-ui/core/styles';
import theme from './temaConfig';

function App() {  
  return(
    <ThemeProvider theme={theme} >
      <Routes />
    </ThemeProvider>
  );
}

export default App;