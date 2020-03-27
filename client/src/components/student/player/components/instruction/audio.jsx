import React from "react";
// Services
import { bucketUrl } from "services/config";
// Components
import AudioPlayer from "../players/audioPlayer";
// Material UI
import { createStyles, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) =>
  createStyles({
    center: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)"
    }
  })
);

const AudioInstruction = (props) => {
  const classes = useStyles();
  return (
    <div className={classes.center}>
      <AudioPlayer
        urls={[{ src: `${bucketUrl}/${props.audio.value}`, type: "audio/mp3" }]}
        hasFocus={props.hasFocus}
        bgColor="rgba(0,0,0,1)"
      />
    </div>
  );
};

export default AudioInstruction;
