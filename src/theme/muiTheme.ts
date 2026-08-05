import { createTheme } from '@mui/material/styles';

const muiTheme = createTheme({
  palette: {
    background: {
      default: '#F8F6F2',
      paper: '#EFEAE3',
    },
    primary: {
      main: '#C7A15A',
      dark: '#8B7355',
      contrastText: '#F8F6F2',
    },
    secondary: {
      main: '#8B7355',
      dark: '#181818',
      contrastText: '#F8F6F2',
    },
    text: {
      primary: '#2E2E2E',
      secondary: '#6E6A64',
    },
    divider: '#DDD7CF',
  },
  typography: {
    fontFamily: "'Jost', system-ui, sans-serif",
    h1: { fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600 },
    h2: { fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600 },
    h3: { fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600 },
    h4: { fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600 },
    h5: { fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600 },
    h6: { fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600 },
  },
  spacing: 8,
  shape: {
    borderRadius: 0,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#F8F6F2',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: 'none',
          textTransform: 'none',
          letterSpacing: '0.15em',
          fontFamily: "'Jost', system-ui, sans-serif",
          fontWeight: 400,
          '&:hover': { boxShadow: 'none' },
        },
      },
    },
  },
});

export default muiTheme;
