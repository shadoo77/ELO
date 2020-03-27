import React from "react";
// Material UI
import { makeStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";

const useStyles = makeStyles({
  container: {
    flexGrow: 1
  },
  root: {
    height: 50,
    margin: 14
  }
});

const Progressbar = (props) => {
  const classes = useStyles();

  return <div className={classes.container}></div>;
};

export default Progressbar;
