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

const useStyles = makeStyles((theme) =>
  createStyles({
    playerWrapper: {
      width: "100%",
      height: "100%",
      position: "relative",
      opacity: 0,
      transition: "opacity .22s ease-out",
      "&:hover $rollOn, &:focus $rollOn, &:active $rollOn": {
        opacity: 1
      }
    },
    reactPlayer: {
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      "& video": { borderRadius: "8px" }
    },
    rollOn: { transition: "opacity .22s ease-in", opacity: 0 },
    rollOff: { transition: "opacity .22s ease-out", opacity: 1 },
    reactControls: {
      display: "flex",
      alignItems: "flex-end",
      width: "100%",
      padding: "0 5% 5% 5%",
      position: "absolute",
      bottom: 0,
      minHeight: 150
    },
    seekBar: { flexGrow: 1, flexShrink: 0 },
    rateBar: { marginLeft: "20px", width: "150px", flexGrow: 0, flexShrink: 1 },
    playContainer: {
      position: "absolute",
      left: "50%",
      bottom: 0,
      transform: "translate(-50%, -150%)",
      display: "flex"
    }
  })
);

const VideoPlayer = (props) => {
  //
  const classes = useStyles();
  const playerRef = useRef(null);

  const [playStatus, setPlaystatus] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(100);
  const [seeking, setSeeking] = useState(false);
  const [seekTime, setSeekTime] = useState(0);
  const [browseTime, setBrowseTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const containerRef = useRef();
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const resizeHandler = () => {
      if (containerRef.current) {
        const width = containerRef.current
          ? containerRef.current.offsetWidth
          : 0;
        setContainerWidth(width);
      }
    };
    resizeHandler();
    window.addEventListener("resize", resizeHandler, false);
    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  useEffect(() => {
    if (!props.hasFocus && playerRef.current) {
      setPlaystatus(false);
    }
  }, [props.hasFocus]);

  function handleReady(e) {
    if (playerRef.current) {
      setDuration(Math.floor(playerRef.current.getDuration()));
      setSeekTime(Math.floor(playerRef.current.getCurrentTime()));
    }
  }

  function handlePositionChanged(event, newValue) {
    const val = Math.floor(parseFloat(newValue));
    if (playerRef.current) {
      playerRef.current.seekTo(val, "seconds");
    }
    setPlaystatus(true);
    setSeekTime(val);
    setBrowseTime(val);
    setSeeking(false);
  }

  function handlePositionChange(event, newValue) {
    setBrowseTime(newValue);
  }

  function handlePlaybackChange(event, newValue) {
    setPlaybackRate(newValue);
  }

  function handleProgress(state) {
    if (!seeking) {
      setSeekTime(state.playedSeconds);
    }
  }

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

  function handleEnded() {
    setPlaystatus(false);
    playerRef.current.seekTo(0, "seconds");
  }

  function togglePlay() {
    setPlaystatus(!playStatus);
  }

  return (
    <div ref={containerRef}>
      <div
        className={classes.playerWrapper}
        style={{
          height: (containerWidth / 16) * 9,
          opacity: duration > 0 ? 1 : 0
        }}
      >
        <ReactPlayer
          ref={playerRef}
          className={classes.reactPlayer}
          url={props.urls}
          controls={false}
          width="100%"
          height="100%"
          playing={playStatus}
          playbackRate={playbackRate / 100}
          onPause={handlePause}
          onProgress={handleProgress}
          onReady={handleReady}
          onEnded={handleEnded}
          progressInterval={200}
        />

        <div
          className={`${classes.reactControls} ${
            playStatus ? classes.rollOn : classes.rollOff
          }`}
          style={{
            background: `-moz-linear-gradient(top, rgba(0,0,0,0) 0%, ${props.bgColor} 150px)`,
            background: `-webkit-linear-gradient(top, rgba(0,0,0,0) 0%, ${props.bgColor} 150px)`,
            background: `linear-gradient(to bottom, rgba(0,0,0,0) 0%, ${props.bgColor} 150px)`
          }}
        >
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

          <div className={classes.seekBar}>
            <Seekbar
              aria-label="seek position slider"
              ValueLabelComponent={toolTipTimestamp}
              valueLabelDisplay="auto"
              value={seeking ? browseTime : seekTime}
              min={0}
              max={duration}
              onChange={handlePositionChange}
              onChangeCommitted={handlePositionChanged}
              onMouseDown={() => {
                setSeeking(true);
              }}
            />
          </div>
          <div className={classes.rateBar}>
            <Grid container spacing={1}>
              <Grid item>
                <span role="img" aria-label="speed up video">
                  🐌
                </span>
              </Grid>
              <Grid item xs>
                <Slider
                  aria-label="playback rate slider"
                  ValueLabelComponent={toolTipPercentage}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(number, index) => {
                    return convertSecondsToTimestamp(number);
                  }}
                  min={50}
                  max={100}
                  step={1}
                  value={playbackRate}
                  onChange={handlePlaybackChange}
                />
              </Grid>
              <Grid item>
                <span role="img" aria-label="speed up video">
                  🐆
                </span>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
