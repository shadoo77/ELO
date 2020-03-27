import React, { useEffect, useState } from "react";
// Components
import {
  AudioContent,
  ImageContent,
  CoverContent,
  VideoContent
} from "../components/content";
import { AudioInstruction } from "../components/instruction";
import Matching from "./matching/index";
import { CustomSend } from "../components/buttons";
// Services
import { apiUrl, bucketUrl, contentTypes, slideStates } from "services/config";
import { httpService } from "services/http";
// Helpers
import { getContentByType } from "./utils/contentManagement";
import { contentPicker } from "./utils/mediaPicker";
// Material UI
import { createStyles, makeStyles, useTheme } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";

const useStyles = makeStyles(theme =>
  createStyles({
    section: { position: "relative" },
    sectionInstruction: {
      marginTop: 40,
      zIndex: 99
    },
    sectionAnswers: {
      border: "1px solid rgba(0,0,0,0.1)",
      padding: "6px 12px",
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

const MatchingSlide = ({ isDragging, ...props }) => {
  const classes = useStyles();

  console.log(
    "SLIDE:",
    props.slide,
    "LAST:",
    lastAnswered,
    "INTERACTIONS:",
    props.slide.interactions,
    "LENGTH:",
    props.slide.interactions.length - 1,
    "ATTEMPT:",
    props.attempt,
    "CONDITION MET?:",
    props.slide.interactions.length - 1 >= props.attempt
  );

  const lastAnswered =
    props.slide.interactions.length - 1 >= props.attempt
      ? props.slide.interactions[props.attempt].answered
      : [];

  const [sets, setSets] = useState({ set1: [], set2: [] });

  function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  }

  useEffect(() => {
    let tmp1 = [];
    let tmp2 = [];
    if (lastAnswered.length > 0) {
      lastAnswered.map((answerArray, index) => {
        const answer1 = props.slide.possibleAnswers.find(
          (answer, index) => answer._id === answerArray[0]
        );
        const answer2 = props.slide.possibleAnswers.find(
          (answer, index) => answer._id === answerArray[1]
        );
        tmp1.push({
          ...answer1,
          type: answer1.items[0].type,
          items: [answer1.items[0]]
        });
        tmp2.push({
          ...answer2,
          type: answer2.items[1].type,
          items: [answer2.items[1]]
        });
      });
    } else {
      props.slide.possibleAnswers.forEach(answer => {
        tmp1.push({
          ...answer,
          type: answer.items[0].type,
          items: [answer.items[0]]
        });
        tmp2.push({
          ...answer,
          type: answer.items[1].type,
          items: [answer.items[1]]
        });
      });
    }
    setSets({
      set1: tmp1,
      set2: lastAnswered.length > 0 ? tmp2 : shuffle(tmp2)
    });
  }, []);

  const renderContent = content => {
    return contentPicker(content, props.slide);
  };

  const renderContents = slide => {
    return slide.content.map(content => renderContent(content));
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

  const renderInstructions = slide => {
    return slide.instructions.map(instruction =>
      renderInstruction(instruction)
    );
  };

  const checkAnswers = () => {
    props.slideshowDispatch({
      type: "updateStates",
      payload: { index: props.index, states: [slideStates.GRADING_INPUT] }
    });

    const isAccepted = sets.set1.every((answer, index) => {
      return answer._id.toString() === sets.set2[index]._id.toString();
    });

    const answered = sets.set1.map((answer1, index) => {
      return [answer1._id, sets.set2[index]._id];
    });

    httpService
      .post(`${apiUrl}/assignment/interaction/matching`, {
        slide: props.slide._id,
        answered,
        isAccepted,
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
      {props.slide && (
        <Grid container>
          <Grid item xs={12}>
            <div className={classes.section}>{renderContents(props.slide)}</div>
          </Grid>
          <Grid item xs={12}>
            <div className={`${classes.section} ${classes.sectionInstruction}`}>
              {renderInstructions(props.slide)}
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className={`${classes.section} ${classes.sectionAnswers}`}>
              {sets.set1 && (
                <Matching
                  slide={props.slide}
                  sets={sets}
                  setSets={setSets}
                  enableDnD={
                    props.slide.states.includes(slideStates.AWAITING_INPUT) &&
                    !props.slide.states.includes(slideStates.OUT_OF_FOCUS) &&
                    lastAnswered.length === 0
                  }
                />
              )}
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className={`${classes.section}`}>
              <div className={classes.sendButton}>
                <CustomSend
                  slideStates={props.slide.states}
                  isDisabled={false}
                  checkAnswerHandler={() => {
                    checkAnswers();
                  }}
                />
              </div>
            </div>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default MatchingSlide;
