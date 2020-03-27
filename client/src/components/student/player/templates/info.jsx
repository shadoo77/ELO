import React, { useEffect, useState } from "react";
// Components
import {
  ImageContent,
  CoverContent,
  VideoContent
} from "../components/content";
import { AudioInstruction } from "../components/instruction";
import { CustomSend } from "../components/buttons";
// Services
import { apiUrl, contentTypes, slideStates } from "services/config";
import { httpService } from "services/http";
// Helpers
import { getContentByType } from "./utils/contentManagement";
import { contentPicker } from "./utils/mediaPicker";
// Material UI
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";

const useStyles = makeStyles(theme => createStyles({}));

const InfoSlide = props => {
  const classes = useStyles();

  const renderContent = content => {
    return contentPicker(content, props.slide);
  };

  // const renderContent = (content) => {
  //   switch (content.type) {
  //     case contentTypes.AUDIO:
  //       return <p>Content can't be of type AUDIO!</p>;
  //     case contentTypes.IMAGE:
  //       return (
  //         <ImageContent
  //           key={`image_content_info${content._id}`}
  //           image={getContentByType(content.items, contentTypes.IMAGE)}
  //         />
  //       );
  //     case contentTypes.AUDIOCOVER:
  //       return (
  //         <CoverContent
  //           key={`audiocover_content_info${content._id}`}
  //           image={getContentByType(content.items, contentTypes.IMAGE)}
  //           audio={getContentByType(content.items, contentTypes.AUDIO)}
  //           hasFocus={!props.slide.states.includes(slideStates.OUT_OF_FOCUS)}
  //         />
  //       );
  //     case contentTypes.VIDEO:
  //       return (
  //         <VideoContent
  //           key={`video_content_info${content._id}`}
  //           video={getContentByType(content.items, contentTypes.VIDEO)}
  //           autoplay={true}
  //           hasFocus={!props.slide.states.includes(slideStates.OUT_OF_FOCUS)}
  //         />
  //       );
  //     default:
  //       throw Error("Could not determine type of content for this content");
  //   }
  // };

  const renderContents = () => {
    if (props.slide && props.slide.content && props.slide.content.length > 0) {
      return props.slide.content.map(content => renderContent(content));
    }
  };

  const renderInstruction = content => {
    switch (content.type) {
      case contentTypes.AUDIO:
        return (
          <AudioInstruction
            key={content._id}
            audio={getContentByType(content.items, contentTypes.AUDIO)}
            hasFocus={!props.slide.states.includes(slideStates.OUT_OF_FOCUS)}
          />
        );
      default:
        throw Error(
          "Could not determine type of content for this instruction",
          content
        );
    }
  };

  const renderInstructions = () => {
    if (
      props.slide &&
      props.slide.instructions &&
      props.slide.instructions.length > 0
    ) {
      return props.slide.instructions.map(instruction =>
        renderInstruction(instruction)
      );
    }
  };

  return (
    <>
      <Grid container className={classes.container}>
        <Grid item xs={12}>
          <div className={classes.section}>{renderInstructions()}</div>
        </Grid>
        <Grid item xs={12}>
          <div className={classes.section}>{renderContents()}</div>
          <div></div>
        </Grid>
      </Grid>
    </>
  );
};

export default InfoSlide;
