"use client"
import { Toaster } from 'react-hot-toast'
import { createTheme, ThemeProvider } from '@mui/material';
import { alignProperty } from '@mui/material/styles/cssUtils';
import { SWRConfig } from 'swr';
import mySwrConfig from '../lib/swr-config';

const theme = createTheme({
  palette: {
    primary: {
      main: '#397EF7',
    },
    secondary: {
      main: '#397EF7',
    },
  },
  typography: {
    allVariants: {
      color: 'black',
    }
  },
  
  

});
// Write the toast options styling so that it ha a blue background and white text and is positioned at the top center of the screen and is poppins font
const toastOptions = {
  style: {
    background: '#397EF7',
    color: 'white',
    fontFamily: 'Poppins',
    padding: '8px',
    margin: "70px 0"
    
  },
  iconTheme: {
    primary: 'white',
    secondary: '#397EF7',
  }
}

export default function  ClientProviver() {
  return (
    <>
    <SWRConfig value={mySwrConfig}/>
      <Toaster  position="top-center" toastOptions={toastOptions} />

    </>
  );
}