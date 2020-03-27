import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import { hot } from "react-hot-loader";
// Components
import ReactPlayer from "react-player";
import Slider from "../components/slider";
import Seekbar from "../components/seekbar";
// Services
import { bucketUrl } from "services/config";
// Utils
import { convertSecondsToTimestamp } from "../utils/time";
import { toolTipTimestamp, toolTipPercentage } from "../components/tooltip";
// Material UI
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Fab from "@material-ui/core/Fab";
// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles(theme =>
  createStyles({
    playerWrapper: {
      width: "100%",
      height: "100%",
      position: "relative",
      opacity: 0,
      transition: "opacity .22s ease-out"
    },
    reactPlayer: {
      position: "absolute",
      top: 0,
      width: 0,
      height: 0
    },
    playContainer: {
      // position: "absolute",
      // left: "50%",
      // top: "50%",
      // transform: "translate(-50%, -50%)"
    }
  })
);

const AudioPlayer = props => {
  //
  const classes = useStyles();
  const playerRef = useRef(null);
  const [playStatus, setPlaystatus] = useState(false);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!props.hasFocus && playerRef.current) {
      setPlaystatus(false);
    }
  }, [props.hasFocus]);

  function handlePause() {
    if (
      playerRef.current &&
      convertSecondsToTimestamp(playerRef.current.getCurrentTime()) ===
        props.endTime
    ) {
      setPlaystatus(false);
      playerRef.current.seekTo(
        moment.duration(`00:${props.startTime}`).asSeconds(),
        "seconds"
      );
    }
  }

  function handleReady(e) {
    if (playerRef.current) {
      setDuration(Math.floor(playerRef.current.getDuration()));
    }
  }

  function handleEnded() {
    setPlaystatus(false);
    playerRef.current.seekTo(0, "seconds");
  }

  function togglePlay() {
    setPlaystatus(!playStatus);
  }

  return (
    <div>
      <div
        className={classes.playerWrapper}
        style={{
          opacity: duration > 0 ? 1 : 0
        }}
      >
        <ReactPlayer
          ref={playerRef}
          className={classes.reactPlayer}
          url={props.urls}
          controls={false}
          width="100%"
          height="0"
          playing={playStatus}
          onPause={handlePause}
          onEnded={handleEnded}
          onReady={handleReady}
        />
        <div className={classes.playContainer}>
          <Fab color="primary" aria-label="add" onClick={togglePlay}>
            <FontAwesomeIcon
              icon={playStatus ? faPause : faPlay}
              style={{
                color: "white"
              }}
            />
          </Fab>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
