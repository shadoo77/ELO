import React from "react";
// Material Ui components
import { Box } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  container: {
    width: "100%",
    height: 100,
    borderRight: "2px solid #fff",
    borderRadius: 0,
    padding: 0,
    position: "relative",
    backgroundColor: "#FAFAFA"
  },
  disabledColor: {
    backgroundColor: "#FAFAFA"
  },
  progress: {
    backgroundColor: "#FAFAFA",
    width: "88%",
    position: "absolute",
    bottom: 0,
    borderRadius: 4
  },
  correct: {
    backgroundColor: "#48b648",
    width: "100%"
  },
  wrong: {
    backgroundColor: "#cb2026",
    width: "100%"
  }
});

export default function(props) {
  const classes = useStyles();

  const totalPercentage = props.interaction
    ? props.interaction.percentages.progress
    : 0;

  const wrongPercentage = props.interaction
    ? props.interaction.percentages.wrong
    : 0;
  const correctPercentage = props.interaction
    ? props.interaction.percentages.correct
    : 0;

  return (
    <>
      <div
        className={`${classes.container} ${
          props.isDisabled ? classes.disabledColor : ""
        }`}
      >
        <div style={{ padding: "0 6%" }}>
          {props.interaction && (
            <div
              className={classes.progress}
              style={{
                height: props.isDisabled ? "0%" : `${totalPercentage}%`,
                maxHeight: props.isDisabled ? "0%" : `${totalPercentage}%`
              }}
            >
              <div
                className={classes.wrong}
                style={{
                  height: props.isDisabled ? "0%" : `${wrongPercentage}%`,
                  maxHeight: props.isDisabled ? "0%" : `${wrongPercentage}%`
                }}
              ></div>

              <div
                className={classes.correct}
                style={{
                  height: props.isDisabled ? "0%" : `${correctPercentage}%`,
                  maxHeight: props.isDisabled ? "0%" : `${correctPercentage}%`
                }}
              ></div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* <div
        className={classes.wrong}
        style={{
          height: props.isDisabled
            ? "0%"
            : `${props.interaction.percentages.wrong}%`
        }}
      ></div>
      <div
        className={classes.correct}
        style={{
          height: props.isDisabled
            ? "0%"
            : `${props.interaction.percentages.progress}%`
        }}
      ></div> */
