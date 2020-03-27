import React, { useState, useEffect, useRef } from "react";
// Components
import ReactPlayer from "react-player";
import Feedback from "./../../components/feedback";
// Services
import { slideStates, bucketUrl } from "services/config";
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
      border: "1px solid rgba(0, 0, 0, 0.4)",
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
    }
  })
);

const AudioAnswer = props => {
  const classes = useStyles();

  const playerRef = useRef(null);
  const [playStatus, setPlaystatus] = useState(false);
  const isMultiAnswer = props.slide.hasOwnProperty("correctAnswers")
    ? props.slide.correctAnswers.length > 1
    : false;

  useEffect(() => {
    if (!props.hasFocus && playerRef.current) {
      setPlaystatus(false);
    }
  }, [props.hasFocus]);

  function handleEnded() {
    setPlaystatus(false);
    playerRef.current.seekTo(0, "seconds");
  }

  function togglePlay() {
    setPlaystatus(!playStatus);
  }

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
          onClick={() => {
            if (props.slide.states.includes(slideStates.AWAITING_INPUT)) {
              props.clickHandler();
            }
            setPlaystatus(true);
          }}
          // disabled={!props.slide.states.includes(slideStates.AWAITING_INPUT)}
          className={classes.root}
        >
          <FontAwesomeIcon
            icon={faVolumeUp}
            style={{
              width: "20%",
              height: "auto",
              minHeight: "100px",
              transform: "translate(200%, 0%)",
              color: "rgba(235, 77, 128, .8)"
            }}
          />
          <ReactPlayer
            ref={playerRef}
            className={classes.reactPlayer}
            url={[
              {
                src: `${bucketUrl}/${props.audio.value}`,
                type: "audio/mp3"
              }
            ]}
            controls={false}
            width="100%"
            height="0"
            playing={playStatus}
            onPause={handleEnded}
            onEnded={handleEnded}
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

export default AudioAnswer;
