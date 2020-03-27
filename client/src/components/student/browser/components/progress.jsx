import React from "react";
// Material UI
import { makeStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";

const useStyles = makeStyles({
  container: {
    flexGrow: 1
  },
  root: {
    height: 12
  }
});

const Progressbar = (props) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <LinearProgress
        className={classes.root}
        variant="determinate"
        value={props.progress}
        // valueBuffer={props.progress + 20}
      />
    </div>
  );
};

export default Progressbar;
