"use client"
import { Toaster } from 'react-hot-toast'
import { createTheme, ThemeProvider } from '@mui/material';

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


export default function  ClientProviver() {
  return (
    <>
      <ThemeProvider theme={theme}/>
    <Toaster position="top-center"  />
    </>
  );
}