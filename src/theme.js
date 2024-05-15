import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
   shadows: [
      'none',
      '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
      // Другие значения теней
   ], // заменил
   palette: {
      primary: {
         main: '#ffff',
      },
   },
   typography: {
      button: {
         textTransform: 'none',
         fontWeight: 400,
      },
   },
});
