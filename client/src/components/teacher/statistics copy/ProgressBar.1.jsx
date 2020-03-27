import React from "react";
// Material Ui components
import { Box } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  container: {
    width: "100%",
    height: "70px",
    backgroundColor: ({ allQuestions }) => (allQuestions > 0 ? "#ccc" : "red"),
    border: "solid #ccc 1px",
    borderRadius: 5,
    padding: 0,
    position: "relative"
  },
  child: {
    borderRadius: 5,
    backgroundColor: "blue",
    margin: 0,
    padding: 0,
    width: `100%`,
    height: ({ childPrecent }) => `${childPrecent}%`,
    position: "absolute",
    transition: "height 1s",
    WebkitTransition: "height 1s",
    bottom: 0,
    left: 0,
    right: 0
  }
});

export default function(props) {
  const { hasAnswered, allQuestions } = props;
  let childPrecent = (hasAnswered * 100) / allQuestions;
  childPrecent = Math.round(childPrecent);
  const classes = useStyles({ childPrecent, allQuestions });

  return (
    <Box className={classes.container}>
      <div className={classes.child}></div>
    </Box>
  );
}
