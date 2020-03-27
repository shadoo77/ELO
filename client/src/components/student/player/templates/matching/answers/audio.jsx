import React from "react";
// Components
import Feedback from "./../../components/feedback";
// Services
import { slideStates } from "services/config";
// Material UI
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { ButtonBase } from "@material-ui/core";
// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeUp } from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles(theme =>
  createStyles({
    outerContainer: {
      width: "100%",
      height: "100%",
      borderRadius: 4,
      boxSizing: "border-box",
      transition: "background-color .22s ease-out"
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
        <FontAwesomeIcon
          icon={faVolumeUp}
          style={{
            width: "25%",
            height: "auto",
            transform: "translate(0%, 0%)",
            color: "rgba(235, 77, 128, .8)"
          }}
        />
        {props.isDraggable &&
          props.slide.states.includes(slideStates.DISPLAYING_FEEDBACK) && (
            <Feedback isCorrect={props.isCorrect} />
          )}
      </div>
    </div>
  );
}
