import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  cssVariables: true, //Para exportar como variables reutilizables
  palette: {
    primary: { main: '#1565C0', dark: '#0D47A1', light: '#EAF6FC', contrastText: '#FFFFFF' },
    secondary: { main: '#29A9E1', contrastText: '#0F2A44' },
    success: { main: '#5E9E1F', light: '#EEF7E4', dark: '#3F6B12', contrastText: '#FFFFFF' },
    warning: { main: '#F2A93B', light: '#FFF4D6', dark: '#8A5A00', contrastText: '#0F2A44' },
    error: { main: '#C62828', light: '#FDECEC', dark: '#B3261E', contrastText: '#FFFFFF' },
    background: { default: '#EAF6FC', paper: '#FFFFFF' },
    text: { primary: '#0F2A44', secondary: '#5B6B7C' },
    divider: '#D6E6F2',
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: "'Nunito', system-ui, sans-serif",
    h1: { fontSize: '1.875rem', fontWeight: 800 },
    h2: { fontSize: '1.5rem', fontWeight: 800 },
    h3: { fontSize: '1.125rem', fontWeight: 800 },
    h4: { fontSize: '2.75rem', fontWeight: 800, lineHeight: 1 },
    subtitle1: { fontWeight: 700 },
    body2: { color: '#5B6B7C' },
    button: { textTransform: 'none', fontWeight: 800 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 'var(--rg-radius-md)',
          minHeight: 44,
          paddingInline: 18,
          variants: [
            { props: { variant: 'contained', color: 'primary' }, style: { boxShadow: 'var(--rg-shadow-button)' } },
          ],
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: 'var(--rg-radius-lg)',
          border: 'var(--rg-border)',
          boxShadow: 'var(--rg-shadow-card)',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 'var(--rg-radius-md)',
          backgroundColor: '#FFFFFF',
          '& .MuiOutlinedInput-notchedOutline': { borderColor: '#C9DCEB', borderWidth: 1.5 },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#29A9E1' },
        },
      },
    },
  },
});