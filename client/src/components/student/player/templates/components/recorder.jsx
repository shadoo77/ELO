import React, { useState, useRef, useEffect } from "react";
// Material UI
import { createStyles, makeStyles } from "@material-ui/core/styles";
// Mic
import { ReactMic } from "react-mic";
import Fab from "@material-ui/core/Fab";
// Icons
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
import PauseIcon from "@material-ui/icons/Pause";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";

const useStyles = makeStyles(theme => createStyles({}));

export default props => {
  //
  const [recording, setRecording] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [blobData, setBlobData] = useState(null);
  const playerRef = useRef(null);

  const playAudio = () => {
    playerRef.current.play();
    props.setDisableSubmit(false);
  };

  const toggleRecording = () => {
    setRecording(!recording);
  };

  useEffect(() => {
    if (blobData === null) {
      props.setDisableSubmit(true);
    } else if (!recording && blobData) {
      props.setDisableSubmit(false);
    }
  }, [recording]);

  const onStop = blobObject => {
    setBlobData(blobObject.blobURL);
  };

  const onData = recordedBlob => {};

  const classes = useStyles();
  return (
    <div style={{ position: "relative", marginBottom: 24 }}>
      <div
        style={{
          opacity: recording ? 1 : 1,
          transition: "height .22s ease",
          transition: "opacity .22s ease",
          height: recording ? 100 : 100,
          display: "flex",
          justifyContent: "center",
          overflow: "hidden"
        }}
      >
        <ReactMic
          record={recording}
          onStop={onStop}
          onData={onData}
          strokeColor="#000000"
          backgroundColor="rgb(250,250,250)"
        />
        <audio
          ref={playerRef}
          controls="controls"
          src={blobData}
          style={{ display: "none" }}
          onDurationChange={() => {
            let dur = playerRef.current.duration;
            if (dur !== Infinity) {
              console.log("DURATION:", dur);
              props.setDuration(playerRef.current.duration);
            }
          }}
        ></audio>
      </div>
      {/* <div
        style={{
          opacity: !recording && blobData ? 1 : 0,
          transition: "height .22s ease",
          transition: "opacity .22s ease",
          height: 0,
          display: "flex",
          justifyContent: "center"
        }}
      > */}
      {/* <audio
          ref={playerRef}
          controls="controls"
          src={blobData}
          style={{ display: "none" }}
        ></audio> */}
      {/* </div> */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingBottom: 60,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -25%)"
        }}
      >
        <Fab
          color="primary"
          aria-label="record"
          onClick={toggleRecording}
          style={{ margin: 6, zIndex: 999 }}
        >
          {recording ? <MicOffIcon /> : <MicIcon />}
        </Fab>
        <Fab
          color="primary"
          aria-label="play"
          disabled={recording || !blobData}
          onClick={playAudio}
          style={{ margin: 6, zIndex: 999 }}
        >
          {playing ? <PauseIcon /> : <PlayArrowIcon />}
        </Fab>
      </div>
    </div>
  );
};
