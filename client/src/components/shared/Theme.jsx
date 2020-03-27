import { createMuiTheme } from "@material-ui/core/styles";

const MainTheme = createMuiTheme({
  breakpoints: {
    keys: ["xs", "sm", "md", "lg", "xl"],
    values: { xs: 0, lg: 1280, sm: 600, xl: 1920, md: 960 }
  },
  palette: {
    common: { black: "#000", white: "#fff" },
    background: { paper: "#fff", default: "#fafafa" },
    primary: {
      light: "#0288d1",
      main: "#0277bd",
      dark: "#01579b",
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

const groupTableStyle = () => ({
  deleteIcon: {
    background: "#f44336",
    color: "#fff",
    "&:hover": {
      background: "#d50000"
    }
  }
});

// Disable hover feature on some buttons
const studentsView = theme => ({
  noneHover: {
    cursor: "default",
    "&:hover": {
      backgroundColor: theme.palette.primary.main
    },
    "&:active": {
      outline: "0 !important",
      border: "0 !important"
    },
    "&:focus": {
      outline: "0 !important",
      border: "0 !important"
    }
  },
  addNewStudent: {
    color: "#fff",
    //margin: "20px",
    backgroundColor: "#26a69a",
    "&:hover": {
      backgroundColor: "#00695c"
    }
  },
  iconsButton: {
    "&:active": {
      outline: "0 !important",
      border: "0 !important"
    },
    "&:focus": {
      outline: "0 !important",
      border: "0 !important"
    }
  },
  switchActive: {
    "&:hover": {
      outline: "0 !important",
      border: "0 !important",
      background: "0 !important"
    }
  },
  activeIcon: {
    "&:hover": {
      color: "#00796b"
    }
  },
  unactiveIcon: {
    "&:hover": {
      color: "#d32f2f"
    }
  }
});

// Students status table
const statusTable = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
    //overflowX: "auto"
  },
  table: {
    minWidth: 700
  },
  row: {
    "&:nth-of-type(odd)": {
      backgroundColor: "#e8e8e8"
    }
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  },
  gridListWrapper: {
    boxSizing: "border-box",
    marginTop: "20px",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper
  },
  imageWrapper: {
    borderRadius: "50%"
    // "& img": {
    //   maxWidth: "100%",
    //   height: "auto"
    // }
  },
  bigAvatar: {
    border: "2px solid #fff",
    margin: 10,
    width: 70,
    height: 70,
    webkitTransition: "opacity 1s ease-in-out",
    mozTransition: "opacity 1s ease-in-out",
    oTransition: "opacity 1s ease-in-out",
    transition: "opacity 1s ease-in-out"
  },
  correctColor: {
    backgroundColor: "#26a69a",
    boxShadow:
      "inset 0 2px 9px  rgba(255,255,255,0.3),inset 0 -2px 6px rgba(0,0,0,0.4)"
  },
  wrongColor: {
    backgroundColor: theme.palette.secondary.main,
    boxShadow:
      "inset 0 2px 9px  rgba(255,255,255,0.3),inset 0 -2px 6px rgba(0,0,0,0.4)"
  }
});

// Sidebar menu styles
const sidebarStyles = theme => ({
  toolbar: theme.mixins.toolbar,
  sidebarContainer: {
    display: "flex"
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  drawer: {
    width: "100%",
    backgroundColor: theme.palette.background.paper
  },

  "@media (min-width: 600px)": {
    sidebarContainer: {
      minHeight: "100vh"
    },
    drawer: {
      width: "100%",
      minHeight: "100%",
      position: "relative",
      flexShrink: 0,
      overflowY: "visible",
      alignItems: "flex-start",
      backgroundColor: theme.palette.background.paper
    }
  }
});

// TreeView
const treeViewStyle = theme => ({
  listRoot: {
    width: "100%",
    backgroundColor: theme.palette.background.paper
  },
  firstLayer: {
    paddingLeft: theme.spacing(4)
    //backgroundColor: "#dbefff"
  },
  secondLayer: {
    paddingLeft: theme.spacing(7)
  },
  thirdLayer: {
    paddingLeft: theme.spacing(10)
  },
  fourthLayer: {
    paddingLeft: theme.spacing(13)
  },
  "@media (min-width: 600px)": {
    listRoot: {
      //maxWidth: "360px",
      minWidth: "200px"
    }
  }
});

/// //// author home page styles
const authorHomePage = theme => ({
  iconsButton: {
    "&:active": {
      outline: "0 !important",
      border: "0 !important"
    },
    "&:focus": {
      outline: "0 !important",
      border: "0 !important"
    }
  },
  addButton: {
    color: "#fff",
    //margin: "20px",
    backgroundColor: "#26a69a",
    "&:hover": {
      backgroundColor: "#00695c"
    }
  }
});

export {
  MainTheme,
  groupTableStyle,
  //NavbarStyles,
  studentsView,
  statusTable,
  sidebarStyles,
  treeViewStyle,
  authorHomePage
};
