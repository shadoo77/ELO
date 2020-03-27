import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import { hot } from "react-hot-loader";
// Components
import ReactPlayer from "react-player";
import Slider from "../components/slider";
import Seekbar from "../components/seekbar";
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
      position: "relative"
    },
    reactPlayer: {
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)"
    },

    responsiveImage: {
      maxWidth: "100%",
      borderRadius: "8px",
      display: "block"
    }
  })
);

const ImagePlayer = props => {
  //
  const classes = useStyles();
  const playerRef = useRef(null);

  const containerRef = useRef();
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [currentWidth, setcurrentWidth] = useState(0);

  useEffect(() => {
    const resizeHandler = () => {
      if (containerRef.current) {
        const width = containerRef.current
          ? containerRef.current.offsetWidth
          : 0;
        setcurrentWidth(width);
      }
    };
    resizeHandler();
    window.addEventListener("resize", resizeHandler, false);
    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  return (
    <div ref={containerRef}>
      <div
        className={classes.playerWrapper}
        style={{
          width: "100%",
          height:
            ((currentWidth ? currentWidth : containerSize.width) /
              containerSize.width) *
            containerSize.height,
          opacity: containerSize.height > 0 ? 1 : 0
        }}
      >
        <img
          src={props.cover}
          className={`${classes.reactPlayer} ${classes.responsiveImage}`}
          style={{
            width: "100%",
            height:
              ((currentWidth ? currentWidth : containerSize.width) /
                containerSize.width) *
              containerSize.height
          }}
          alt="background for audioplayer"
          onLoad={event =>
            setContainerSize({
              width: event.target.width,
              height: event.target.height
            })
          }
        />
      </div>
    </div>
  );
};

export default ImagePlayer;
