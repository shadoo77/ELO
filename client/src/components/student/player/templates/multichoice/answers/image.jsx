import React, { useState, useEffect } from "react";
// Components
import Feedback from "./../../components/feedback";
// Services
import { slideStates, bucketUrl } from "services/config";
// Material UI
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { ButtonBase } from "@material-ui/core";

const useStyles = makeStyles(theme =>
  createStyles({
    outerContainer: {
      width: "100%",
      height: "100%",
      borderRadius: 4,
      boxSizing: "border-box",
      border: "1px solid rgba(0, 0, 0, 0.25)",
      padding: "2%"
    },
    innerContainer: {
      height: "100%",
      backgroundColor: "rgb(250,250,250)",
      borderRadius: 4,
      display: "flex",
      justifyContent: "center"
    },
    default: {
      backgroundColor: "rgb(250,250,250)"
    },
    selected: {
      backgroundColor: "rgb(63,81,181)"
    },
    correct: {
      backgroundColor: "rgb(72,182,72)"
    },
    wrong: {
      backgroundColor: "rgb(203,32,38)"
    },
    image: {
      width: "100%",
      maxWidth: "100%",
      height: "auto",
      display: "block"
    }
  })
);

const ImageAnswer = props => {
  const classes = useStyles();
  console.log(props.image);
  const isMultiAnswer = props.slide.hasOwnProperty("correctAnswers")
    ? props.slide.correctAnswers.length > 1
    : false;

  const pickColor = () => {
    if (
      props.isSelected &&
      !props.slide.states.includes(slideStates.DISPLAYING_FEEDBACK)
    ) {
      return classes.selected;
    } else if (
      props.slide.states.includes(slideStates.DISPLAYING_FEEDBACK) &&
      props.isSelected &&
      props.isCorrect
    ) {
      return classes.correct;
    } else if (
      props.slide.states.includes(slideStates.DISPLAYING_FEEDBACK) &&
      props.isSelected &&
      !props.isCorrect
    ) {
      return classes.wrong;
    } else if (
      isMultiAnswer &&
      props.isSelected &&
      props.isCorrect &&
      props.slide.states.includes(slideStates.DISPLAYING_FEEDBACK)
    ) {
      return classes.correct;
    } else if (
      isMultiAnswer &&
      !props.isSelected &&
      !props.isCorrect &&
      props.slide.states.includes(slideStates.DISPLAYING_FEEDBACK)
    ) {
      return classes.default;
    } else if (
      isMultiAnswer &&
      props.isSelected &&
      !props.isCorrect &&
      props.slide.states.includes(slideStates.DISPLAYING_FEEDBACK)
    ) {
      return classes.wrong;
    } else if (
      isMultiAnswer &&
      !props.isSelected &&
      props.isCorrect &&
      props.slide.states.includes(slideStates.DISPLAYING_FEEDBACK)
    ) {
      return classes.default;
    }
    return classes.default;
  };

  return (
    <div className={`${classes.outerContainer} ${pickColor()}`}>
      <div className={classes.innerContainer}>
        <ButtonBase
          onClick={props.clickHandler}
          disabled={!props.slide.states.includes(slideStates.AWAITING_INPUT)}
        >
          <img
            className={classes.image}
            src={`${bucketUrl}/smaller/${props.image.value}`}
            alt={`answer ${props.image.value}`}
          />
          {(props.isSelected || isMultiAnswer) &&
            props.slide.states.includes(slideStates.DISPLAYING_FEEDBACK) && (
              <Feedback
                isCorrect={
                  (!isMultiAnswer && props.isCorrect) ||
                  (isMultiAnswer && props.isSelected && props.isCorrect) ||
                  (isMultiAnswer && !props.isSelected && !props.isCorrect)
                }
              />
            )}
        </ButtonBase>
      </div>
    </div>
  );
};

export default ImageAnswer;
