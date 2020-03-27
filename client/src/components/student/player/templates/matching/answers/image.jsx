import React from "react";
// Components
import Feedback from "./../../components/feedback";
// Services
import { slideStates, bucketUrl } from "services/config";
// Material UI
import { createStyles, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme =>
  createStyles({
    outerContainer: {
      width: "100%",
      height: "100%",
      borderRadius: 4
    },
    innerContainer: {
      backgroundColor: "rgb(250,250,250)",
      borderRadius: 4,
      display: "flex",
      justifyContent: "center",
      position: "relative"
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
      objectFit: "cover",
      width: "100%",
      maxWidth: "100%",
      height: "auto",
      display: "block"
    }
  })
);

export default function(props) {
  const classes = useStyles();

  const pickColor = () => {
    if (
      props.isDragging &&
      !props.slide.states.includes(slideStates.DISPLAYING_FEEDBACK)
    ) {
      return classes.selected;
    } else if (
      props.slide.states.includes(slideStates.DISPLAYING_FEEDBACK) &&
      props.isCorrect
    ) {
      return classes.correct;
    } else if (
      props.slide.states.includes(slideStates.DISPLAYING_FEEDBACK) &&
      !props.isCorrect
    ) {
      return classes.wrong;
    }
    return classes.default;
  };

  return (
    <div
      className={`${classes.outerContainer} ${pickColor()}`}
      style={{
        border: props.isDraggable ? "1px solid rgba(0, 0, 0, 0.4)" : "0",
        padding: props.isDraggable ? "2%" : "0"
      }}
    >
      <div
        className={classes.innerContainer}
        style={{
          height: "100%",
          overflow: "hidden"
        }}
      >
        <img
          className={classes.image}
          src={`${bucketUrl}/smaller/${props.image.value}`}
          alt={`answer ${props.image.value}`}
        />
        {props.isDraggable &&
          props.slide.states.includes(slideStates.DISPLAYING_FEEDBACK) && (
            <Feedback isCorrect={props.isCorrect} />
          )}
      </div>
    </div>
  );
}
