import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
// Components
import { CustomFabSpinner } from "../../buttons";
// Services
import { bucketUrl } from "services/config";
// Material UI
import { createStyles, makeStyles } from "@material-ui/core/styles";
// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
// import { faEye } from "@fortawesome/fontawesome-free-regular";

const useStyles = makeStyles((theme) =>
  createStyles({
    videoContainer: {
      position: "relative",
      overflow: "visible",
      width: "100%",
      zIndex: 1,
      borderBottom: "1px solid #efefef"
    },
    wrapIcon: {
      position: "relative"
    },
    centerIcon: {
      opacity: 1,
      zIndex: 99,
      bottom: "10%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      position: "absolute",
      transition: "opacity 0.66s ease-in-out"
    }
  })
);

const VideoPlayer = (props) => {
  const classes = useStyles();
  const [isPlaying, setPlaying] = useState(false);
  const [currentTime, setTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const playerRef = useRef(null);
  const playbackRates = [1.5, 1.4, 1.3, 1.2, 1.1, 1, 0.9, 0.8, 0.7, 0.6, 0.5];

  useEffect(() => {
    if (!props.hasFocus) {
      playerRef.current.pause();
      setPlaying(false);
    }
  }, [props.hasFocus]);

  const toggleRate = () => {
    let index = playbackRates.findIndex((rate) => {
      return playbackRate === rate;
    });

    const newRate =
      index < playbackRates.length - 1
        ? playbackRates[index + 1]
        : playbackRates[0];

    playerRef.current.playbackRate = newRate;
    setPlaybackRate(newRate);
  };

  const togglePlay = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pause();
        setPlaying(false);
      } else {
        playerRef.current.play();
        setPlaying(true);
      }
    }
  };

  function pause() {
    setPlaying(false);
  }

  function end(playerRef) {
    playerRef.current.currentTime = 0; // Set starttime
    playerRef.current.pause(); // Autostart?
    setPlaying(false);
  }

  useEffect(() => {
    // Init
    playerRef.current.controls = false; // Hide controls
    playerRef.current.currentTime = currentTime; // Set starttime

    // Autoplay?
    if (props.autoplay && props.hasFocus) {
      setPlaying(true);
      playerRef.current.play();
    } else {
      playerRef.current.pause();
    }

    // Events
    var doEnd = (event) => end(playerRef);
    playerRef.current.addEventListener("ended", doEnd, false);
    var doPause = (event) => pause();
    playerRef.current.addEventListener("pause", doPause, false);

    return function cleanup() {
      playerRef.current.removeEventListener("ended", doEnd, false);
      playerRef.current.removeEventListener("pause", doPause, false);
    };
  }, [playerRef.current]);

  const parts = props.url.split(".");
  const largeUrl = props.url;
  const smallUrl = `${parts[0]}_small.${parts[1]}`;

  return (
    <>
      {/* <WrapCentered
        topOffset={`-${buttonSize["xs].height"]}px`}
        leftOffset={`-${buttonSize["xs].width/2"]}px`}
      > */}
      <div className={classes.wrapIcon}>
        <div
          className={classes.centerIcon}
          style={{ opacity: isPlaying ? 0 : 1 }}
        >
          <CustomFabSpinner
            icon={
              !isPlaying ? (
                <FontAwesomeIcon
                  icon={faPlay}
                  style={{ fontSize: 30, marginLeft: 2 }}
                />
              ) : (
                <FontAwesomeIcon icon={faPause} style={{ fontSize: 28 }} />
              )
            }
            clickHandler={() => {
              togglePlay();
            }}
          />
          {/*<CustomSpacer />
         <WrapBadge
         content={playbackRate.toString()}
         color="secondary"
         >
         <CustomFab
         size="small"
         iconName="speed"
         clickHandler={() => {
           toggleRate();
          }}
          />
        </WrapBadge> */}
        </div>
        {/* </WrapCentered> */}
        <video
          className={classes.videoContainer}
          ref={playerRef}
          onClick={togglePlay}
          autoPlay={props.autoplay}
        >
          <source
            //  src={`${process.env.PUBLIC_URL}/videos/${props.url}#t=${props.time}`}
            // src={`${props.url}#t=${props.time}`}
            src={`${bucketUrl}/${smallUrl}${props.time}`}
            type="video/mp4"
            media="all and (max-width: 480px)"
          />
          <source
            //  src={`${process.env.PUBLIC_URL}/videos/${props.url}#t=${props.time}`}
            // src={`${props.url}#t=${props.time}`}
            src={`${bucketUrl}/${largeUrl}${props.time}`}
            type="video/mp4"
          />
        </video>
      </div>
    </>
  );
};

VideoPlayer.propTypes = {
  url: PropTypes.string.isRequired
};

export default VideoPlayer;
