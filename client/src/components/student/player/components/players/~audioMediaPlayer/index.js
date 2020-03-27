import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
// Components
import ReactPlayer from "react-player";
// Services
import { bucketUrl } from "services/config";
// Material UI
import { createStyles, makeStyles, withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Slider from "@material-ui/core/Slider";
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";
// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles((theme) =>
  createStyles({
    reactControls: {
      width: "100%",
      height: "auto",

      // padding: "2% 5%",
      // height: "50px",

      // minHeight: 100,

      // marginTop: "-50px",
      display: "flex",
      alignItems: "flex-end",
      position: "relative",
      opacity: 1,
      transition: "opacity .22s ease-in-out",
      borderRadius: 8,
      // margin: "16px 10px",
      marginBottom: 20
    },
    seekBar: { flexGrow: 1, flexShrink: 0 },
    rateBar: { marginLeft: "20px", width: "150px", flexGrow: 0, flexShrink: 1 },
    playContainer: {
      position: "absolute",
      left: "50%",
      bottom: 10,
      transform: "translate(-50%, -100%)",
      margin: "0 auto",
      width: "100%",
      textAlign: "center"
    }
  })
);

function pad(num, size) {
  var s = "000000000" + num;
  return s.substr(s.length - size);
}

function convertSecondsToTimestamp(time) {
  const currentTimeSeconds = Math.floor(time);
  const stampSeconds = pad(currentTimeSeconds % 60, 2);
  const stampMinutes = pad((currentTimeSeconds - stampSeconds) / 60, 2);
  return `${stampMinutes}:${stampSeconds}`;
}

function ValueLabelComponent2(props) {
  const { children, open, value } = props;

  const popperRef = React.useRef(null);
  React.useEffect(() => {
    if (popperRef.current) {
      popperRef.current.update();
    }
  });

  return (
    <Tooltip
      PopperProps={{
        popperRef
      }}
      open={open}
      enterTouchDelay={0}
      placement="top"
      title={`${value}%`}
    >
      {children}
    </Tooltip>
  );
}

function ValueLabelComponent(props) {
  const { children, open, value } = props;

  const popperRef = React.useRef(null);
  React.useEffect(() => {
    if (popperRef.current) {
      popperRef.current.update();
    }
  });

  return (
    <Tooltip
      PopperProps={{
        popperRef
      }}
      open={open}
      enterTouchDelay={0}
      placement="top"
      title={convertSecondsToTimestamp(value)}
    >
      {children}
    </Tooltip>
  );
}

const PrettoSlider = withStyles({
  root: {
    color: "#fff",
    height: 8
  },
  thumb: {
    height: 20,
    width: 20,
    backgroundColor: "#0277bd",
    border: "2px solid currentColor",
    marginTop: -6,
    marginLeft: -10,
    "&:focus,&:hover,&$active": {
      backgroundColor: "#01579b",
      boxShadow: "inherit"
    }
  },
  active: {},
  track: {
    height: 8,
    borderRadius: 4
  },
  rail: {
    height: 8,
    borderRadius: 4
  }
})(Slider);

const AudioMediaPlayer = (props) => {
  //
  const classes = useStyles();
  const playerRef = useRef(null);

  const [playStatus, setPlaystatus] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(100);
  const [seeking, setSeeking] = useState(false);
  const [seekTime, setSeekTime] = useState(0);
  const [browseTime, setBrowseTime] = useState(0);
  const [duration, setDuration] = useState(0);

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

  function handleProgress(state) {
    if (!seeking) {
      setSeekTime(state.playedSeconds);
    }
  }

  function resetAfterPause() {
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

  function togglePlay() {
    setPlaystatus(!playStatus);
  }

  function resetMedia() {
    if (playerRef.current) {
      setPlaystatus(false);
      playerRef.current.seekTo(0, "seconds");
    }
  }

  return (
    <div

    // style={{
    // background: `url('${bucketUrl}/${props.cover}')`,
    // backgroundSize: "cover",
    // backgroundPosition: "center"
    // }}
    >
      <ReactPlayer
        width="100%"
        height="100%"
        ref={playerRef}
        url={`${bucketUrl}/${props.url}`}
        controls={false}
        playing={playStatus}
        playbackRate={playbackRate / 100}
        config={{
          file: {
            playerVars: {},
            attributes: {
              // poster: `${bucketUrl}/${props.cover}`
            }
          }
        }}
        onPause={resetAfterPause}
        onProgress={handleProgress}
        onReady={handleReady}
        onEnded={resetMedia}
      />
      <div
        className={classes.reactControls}
        style={{
          background: `-moz-linear-gradient(top, rgba(0,0,0,0) 0%, ${props.bgColor} 150px);`,
          background: `-webkit-linear-gradient(top, rgba(0,0,0,0) 0%, ${props.bgColor} 150px);`,
          background: `linear-gradient(to bottom, rgba(0,0,0,0) 0%, ${props.bgColor} 150px);`
        }}
      >
        {/* <div style={{ position: "absolute" }} className={classes.imageWrapper}>
          <div className={classes.image}> */}
        <img
          src={`${bucketUrl}/smaller/${props.cover}`}
          style={{
            maxWidth: "100%",
            height: "auto",
            display: "block"
          }}
        />
        {/* </div>
        </div> */}

        <div
          style={{
            position: "absolute",
            display: "flex",
            // padding: 20,
            width: "100%"
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
            <PrettoSlider
              ValueLabelComponent={ValueLabelComponent}
              valueLabelDisplay="auto"
              // valueLabelFormat={(number, index) => {
              //   return convertSecondsToTimestamp(number);
              // }}
              aria-label="pretto slider"
              // value={seekTime}
              value={seeking ? browseTime : seekTime}
              onMouseDown={() => {
                setSeeking(true);
              }}
              onChange={(event, newValue) => {
                setBrowseTime(newValue);
              }}
              onChangeCommitted={(event, newValue) => {
                const val = Math.floor(parseFloat(newValue));
                if (playerRef.current) {
                  playerRef.current.seekTo(val, "seconds");
                }
                setPlaystatus(true);
                setSeekTime(val);
                setBrowseTime(val);
                setSeeking(false);
              }}
              min={0}
              max={duration}
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
                <PrettoSlider
                  ValueLabelComponent={ValueLabelComponent2}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(number, index) => {
                    return convertSecondsToTimestamp(number);
                  }}
                  aria-label="playback rate slider"
                  value={playbackRate}
                  onChange={(event, newValue) => setPlaybackRate(newValue)}
                  step={1}
                  min={50}
                  max={100}
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

export default AudioMediaPlayer;
