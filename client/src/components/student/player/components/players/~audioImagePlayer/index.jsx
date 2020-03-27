import React from "react";
// Components
import AudioMediaPlayer from "../~audioMediaPlayer";

const AudioImagePlayer = (props) => {
  return (
    // <WrapCentered>
    <AudioMediaPlayer
      url={props.audioUrl}
      cover={props.imageUrl}
      hasFocus={props.hasFocus}
      bgColor="rgba(0,0,0,1)"
    />
    // </WrapCentered>
  );
};

export default AudioImagePlayer;
