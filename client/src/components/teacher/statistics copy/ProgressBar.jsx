import React, { useState, useEffect } from "react";
// Material Ui components
import { Box } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  container: {
    width: "100%",
    height: "30px",
    backgroundColor: "#ccc",
    border: "solid #ccc 1px",
    borderRadius: 5,
    padding: 0,
    position: "relative"
  },
  child: {
    width: ({ stateWidth }) => `${stateWidth}%`,
    height: ({ stateHeight }) => `${stateHeight}%`,
    borderRadius: 5,
    backgroundColor: ({ allQuestions }) => (allQuestions > 0 ? "blue" : "red"),
    margin: 0,
    padding: 0,
    transition: "width 1s",
    WebkitTransition: "width 1s",
    [theme.breakpoints.down("xs")]: {
      width: ({ stateWidth }) => `${stateWidth}%`,
      height: ({ stateHeight }) => `${stateHeight}%`,
      position: "absolute",
      transition: "height 1s",
      WebkitTransition: "height 1s",
      bottom: 0,
      left: 0,
      right: 0
    }
  }
}));

export default function(props) {
  const { hasAnswered, allQuestions } = props;
  let childPrecent = (hasAnswered * 100) / allQuestions;
  childPrecent = Math.round(childPrecent);
  const [state, setState] = useState({
    width: "",
    height: ""
  });
  const stateWidth = state.width;
  const stateHeight = state.height;
  const classes = useStyles({ stateWidth, stateHeight, allQuestions });

  // Hook willmount with return to clean the memory
  useEffect(() => {
    setState({
      ...state,
      width: window.innerWidth > 600 ? childPrecent : 100,
      height: window.innerWidth > 600 ? 100 : childPrecent
    });
    window.addEventListener("resize", resizeHandler, false);
    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  // Resize handler function
  function resizeHandler(e) {
    setState({
      ...state,
      width: e.target.innerWidth > 600 ? childPrecent : 100,
      height: e.target.innerWidth > 600 ? 100 : childPrecent
    });
  }

  return (
    <Box className={classes.container}>
      <div className={classes.child}></div>
    </Box>
  );
}
