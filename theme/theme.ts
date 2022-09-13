import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: "#03ab9d",
      contrastText: "white",
    },
    secondary: {
      main: "#9c27b0",
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;
