import React, { useEffect, useState, useContext } from "react";
// Components
import {
  ImageContent,
  CoverContent,
  VideoContent
} from "../components/content";
import Recorder from "./components/recorder";
import { AudioInstruction, CoverInstruction } from "../components/instruction";
import { CustomSend } from "../components/buttons";
// Services
import { apiUrl, contentTypes, slideStates } from "services/config";
// Helpers
import { getContentByType } from "./utils/contentManagement";
import { contentPicker } from "./utils/mediaPicker";
import { httpService } from "services/http";
// Material UI
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";

const useStyles = makeStyles(theme =>
  createStyles({
    section: { position: "relative" },
    sectionInstruction: {
      marginTop: 40,
      zIndex: 99
    },
    sectionAnswers: {
      display: "grid",
      gridTemplateColumns: ({ widthPercentage }) => widthPercentage,
      gridRow: "auto",
      gridColumnGap: "2%",
      gridRowGap: "2%",
      border: "1px solid rgba(0,0,0,0.1)",
      padding: 12,
      borderRadius: 8,
      margin: "0 12px"
    },
    sendButton: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)"
    }
  })
);

const FlashcardSlide = props => {
  const classes = useStyles();

  const [duration, setDuration] = useState(0);
  const [disableSubmit, setDisableSubmit] = useState(true);

  const renderContent = content => {
    return contentPicker(content, props.slide);
  };

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
      case contentTypes.AUDIOCOVER:
        return (
          <CoverInstruction
            key={content._id}
            audio={getContentByType(content.items, contentTypes.AUDIO)}
            hasFocus={!props.slide.states.includes(slideStates.OUT_OF_FOCUS)}
            slide={props.slide}
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
    } else {
      return renderInstruction({
        items: [
          { type: contentTypes.AUDIO, value: "luister.mp3" },
          { type: contentTypes.IMAGE, value: "luister.png" }
        ],
        type: contentTypes.AUDIOCOVER
      });
    }
  };

  const checkAnswers = () => {
    props.slideshowDispatch({
      type: "updateStates",
      payload: { index: props.index, states: [slideStates.GRADING_INPUT] }
    });

    httpService
      .post(`${apiUrl}/assignment/interaction/flashcard`, {
        slide: props.slide._id,
        duration,
        assignmentId: props.assignmentId
      })
      .then(response => {
        setTimeout(() => {
          if (!response) {
            console.error("no interaction update response!");
            return;
          }
          props.slideshowDispatch({
            type: "addInteraction",
            payload: {
              index: props.index,
              interaction: response
            }
          });
        }, Math.random() * 400 + 400);
      })
      .catch(ex => {
        console.error("Could not save interaction!", ex);
      });
  };

  return (
    <>
      <Grid container className={classes.container}>
        <Grid item xs={12}>
          <div className={`${classes.section} ${classes.sectionInstruction}`}>
            {renderInstructions(props.slide)}
          </div>
        </Grid>
        <Grid item xs={12}>
          <div className={`${classes.section} ${classes.sectionAnswers}`}>
            {renderContents(props.slide)}
            <Recorder
              setDisableSubmit={setDisableSubmit}
              setDuration={setDuration}
            />
          </div>
        </Grid>
        <Grid item xs={12}>
          <div className={`${classes.section}`}>
            <div className={classes.sendButton}>
              <CustomSend
                slideStates={props.slide.states}
                isDisabled={disableSubmit}
                checkAnswerHandler={checkAnswers}
              />
            </div>
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default FlashcardSlide;
