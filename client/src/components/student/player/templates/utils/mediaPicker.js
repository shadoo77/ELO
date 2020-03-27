import React from "react";
// Components
import {
  AudioContent,
  ImageContent,
  CoverContent,
  VideoContent
} from "../../components/content";
// Services
import { contentTypes, slideStates } from "services/config";
import { getContentByType } from "./contentManagement";

export const contentPicker = (content, slide) => {
  switch (content.type) {
    case contentTypes.AUDIO:
      return (
        <AudioContent
          key={`audio_content_${content._id}`}
          audio={getContentByType(content.items, contentTypes.AUDIO)}
          hasFocus={!slide.states.includes(slideStates.OUT_OF_FOCUS)}
        />
      );
    case contentTypes.IMAGE:
      return (
        <ImageContent
          key={`image_content_${content._id}`}
          image={getContentByType(content.items, contentTypes.IMAGE)}
        />
      );
    case contentTypes.AUDIOCOVER:
      return (
        <CoverContent
          key={`audiocover_content_${content._id}`}
          image={getContentByType(content.items, contentTypes.IMAGE)}
          audio={getContentByType(content.items, contentTypes.AUDIO)}
          hasFocus={!slide.states.includes(slideStates.OUT_OF_FOCUS)}
        />
      );
    case contentTypes.VIDEO:
      return (
        <VideoContent
          key={`video_content_${content._id}`}
          video={getContentByType(content.items, contentTypes.VIDEO)}
          autoplay={true}
          hasFocus={!slide.states.includes(slideStates.OUT_OF_FOCUS)}
        />
      );
    default:
      throw Error("Could not determine type of content for this content");
  }
};
