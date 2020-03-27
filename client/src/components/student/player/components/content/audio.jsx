import React from "react";
// Components
import AudioPlayer from "../players/audioPlayer";
// Services
import { bucketUrl } from "services/config";

const CoverContent = (props) => {
  return (
    <div
      style={{
        minHeight: 100,
        width: "100%",
        position: "relative"
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)"
        }}
      >
        <AudioPlayer
          urls={[
            { src: `${bucketUrl}/${props.audio.value}`, type: "audio/mp3" }
          ]}
          hasFocus={props.hasFocus}
        />
      </div>
    </div>
  );
};

export default CoverContent;
