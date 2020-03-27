import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
// Components
import VideoPlayer from "../players/videoPlayer";
// Services
import { bucketUrl } from "services/config";
// Material UI
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const VideoContent = props => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  const contentParts = props.video.value.split("/");
  const fileParts = contentParts[0].split(".");
  const fileName = isMobile
    ? `${fileParts[0]}_small.${fileParts[1]}`
    : `${fileParts[0]}.${fileParts[1]}`;
  const fileUrl = `${bucketUrl}/${fileName}#t=${contentParts[1]},${contentParts[2]}`;

  return (
    <div>
      <VideoPlayer
        urls={[{ src: fileUrl, type: "video/mp4" }]}
        startTime={contentParts[1]}
        endTime={contentParts[2]}
        autoplay={props.autoplay}
        hasFocus={props.hasFocus}
        bgColor="rgba(0,0,0,1)"
      />
    </div>
  );
};

VideoContent.propTypes = {
  video: PropTypes.object.isRequired
};

export default VideoContent;
