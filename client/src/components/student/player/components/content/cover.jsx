import React from "react";
// Components
import CoverPlayer from "./../players/coverPlayer";
// Services
import { bucketUrl } from "services/config";

const CoverContent = (props) => {
  return (
    <CoverPlayer
      urls={[{ src: `${bucketUrl}/${props.audio.value}`, type: "audio/mp3" }]}
      hasFocus={props.hasFocus}
      cover={`${bucketUrl}/smaller/${props.image.value}`}
      bgColor="rgba(0,0,0,1)"
    />
  );
};

export default CoverContent;
