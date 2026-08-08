import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    nav: Palette['primary'];
  }
  interface PaletteOptions {
    nav?: PaletteOptions['primary'];
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    nav: true;
  }
}
