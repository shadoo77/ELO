import React from "react";
// Material UI
import { createStyles, makeStyles } from "@material-ui/core/styles";
// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp,
  faThumbsDown
} from "@fortawesome/fontawesome-free-regular";
import { faSmile, faFrown } from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles(theme =>
  createStyles({
    container: {
      position: "absolute",
      backgroundColor: "rgb(250,250,250)",
      borderRadius: "50%",
      padding: 6,
      right: "6%",
      bottom: "6%"
    }
  })
);

const Feedback = ({ isVisible, isCorrect }) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <FontAwesomeIcon
        icon={isCorrect ? faSmile : faFrown}
        style={{
          color: isCorrect ? "rgb(72,182,72)" : "rgb(203,32,38)",
          fontSize: 40
        }}
      />
    </div>
  );
};

export default Feedback;
