"use client"
import { Toaster } from 'react-hot-toast'
import { createTheme, ThemeProvider } from '@mui/material';
import { alignProperty } from '@mui/material/styles/cssUtils';

const theme = createTheme({
  palette: {
    primary: {
      main: '#f50057',
    },
    secondary: {
      main: '#dc004e',
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
    fontSize: '20px',
    width: '100%',
    
  },
  iconTheme: {
    primary: 'white',
    secondary: '#397EF7',
  }
}

export default function  ClientProviver() {
  return (
    <>
      <ThemeProvider theme={theme}/>
      <Toaster  position="top-center" toastOptions={toastOptions} />
    </>
  );
}