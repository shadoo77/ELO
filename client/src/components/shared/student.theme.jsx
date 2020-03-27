import { createMuiTheme } from "@material-ui/core/styles";

const StudentTheme = createMuiTheme({
  breakpoints: {
    keys: ["xs", "sm", "md", "lg", "xl"],
    values: { xs: 0, lg: 1280, sm: 600, xl: 1920, md: 960 }
  },
  palette: {
    common: { black: "#000", white: "#fff" },
    background: { paper: "#fff", default: "#ff0000" },
    primary: {
      light: "#ff0000",
      main: "#ff0000",
      dark: "#ff0000",
      contrastText: "#fff"
    },
    secondary: {
      light: "rgba(242, 166, 191, 1)",
      main: "rgba(235, 77, 128, 1)",
      dark: "rgba(169, 22, 70, 1)",
      contrastText: "#fff"
    },
    error: {
      light: "rgba(248, 181, 182, 1)",
      main: "rgba(252, 0, 4, 1)",
      dark: "rgba(145, 0, 0, 1)",
      contrastText: "#fff"
    },
    text: {
      primary: "rgba(0, 0, 0, 0.87)",
      secondary: "rgba(0, 0, 0, 0.54)",
      disabled: "rgba(0, 0, 0, 0.38)",
      hint: "rgba(0, 0, 0, 0.38)",
      shadi: "#ff0"
    }
  },
  typography: {
    useNextVariants: true,
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(",")
  }
});

// Navbar
const NavbarStyles = theme => ({
  root: {
    flexGrow: 1,
    marginBottom: "0em"
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  menuItems: {
    flexGrow: 1,
    display: "none"
  },
  menuItemsMob: {
    flexGrow: 1,
    textAlign: "center"
  },
  normalMenu: {
    visibility: "hidden"
  },

  menuButton: {
    marginLeft: 20,
    marginRight: 20
  },
  mobileMenu: {
    visibility: "visible",
    color: "#fff",
    li: {
      color: "#fff"
    }
  },
  mobSingleItem: {
    display: "flex",
    justifyContent: "center"
  },
  menuButtonLogoNormal: {
    display: "none"
  },
  "@media (min-width: 650px)": {
    menuButtonLogoNormal: {
      display: "block",
      marginLeft: -12,
      marginRight: 20
    },
    menuItems: {
      display: "block"
    },
    menuButton: {
      display: "none"
    },
    menuButtonLogoMob: {
      display: "none"
    },
    mobMenuItems: {
      display: "none"
    }
  }
});

export { StudentTheme, NavbarStyles };
