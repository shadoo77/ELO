import React, { useEffect, useState } from "react";
// Components
import {
  AudioContent,
  ImageContent,
  CoverContent,
  VideoContent
} from "../components/content";
import { AudioInstruction } from "../components/instruction";
import {
  AudioAnswer,
  ImageAnswer,
  CoverAnswer,
  VideoAnswer
} from "./multichoice/answers";
import { CustomSend } from "../components/buttons";
// Services
import { apiUrl, contentTypes, slideStates } from "services/config";
import { httpService } from "services/http";
// Helpers
import { getContentByType } from "./utils/contentManagement";
import { contentPicker } from "./utils/mediaPicker";
// Material UI
import { createStyles, makeStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
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
      gridTemplateRow: ({ heightPercentage }) => heightPercentage,
      gridTemplateColumns: ({ widthPercentage }) => widthPercentage,
      gridRow: "auto",
      gridColumnGap: "2%",
      gridRowGap: "0%",
      border: "1px solid rgba(0,0,0,0.1)",
      padding: 12,
      borderRadius: 8
      // margin: "0 12px"
    },
    sendButton: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)"
    }
  })
);

const MultichoiceSlide = props => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  // Calculate grid size of answers
  const nrOfAnswers = matches ? props.slide.possibleAnswers.length : 1;
  // True/False questions don't need to be large
  let overrideDoubleColumn =
    props.slide.possibleAnswers[0].items.findIndex(
      item =>
        item.type === contentTypes.IMAGE &&
        (item.value === "groenvinkje.png" || item.value === "roodkruis.png")
    ) > -1;
  const widthPercentage = `${(100 - (nrOfAnswers - 1) * 2) / nrOfAnswers}% `;

  const classes = useStyles({
    widthPercentage: overrideDoubleColumn
      ? "49% 49%"
      : widthPercentage.repeat(nrOfAnswers),
    heightPercentage: `${100 - (overrideDoubleColumn ? 2 : nrOfAnswers * 2)}%`
  });

  const lastAnswered =
    props.slide.interactions.length - 1 >= props.attempt
      ? props.slide.interactions[props.attempt].answered
      : [];

  const [selectedAnswers, setSelectedAnswers] = useState(lastAnswered);

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

  const renderAnswer = answer => {
    const selected = isSelected(answer) > -1;
    const multi = props.slide.correctAnswers.length > 1;
    const correct = checkAnswerIsCorrect(
      props.slide.correctAnswers,
      answer._id
    );
    const slide = props.slide;

    switch (answer.type) {
      case contentTypes.AUDIO:
        return (
          <AudioAnswer
            key={answer._id}
            audio={getContentByType(answer.items, contentTypes.AUDIO)}
            isCorrect={correct}
            isSelected={selected}
            isMultiAnswer={multi}
            clickHandler={() => {
              doAnswer(answer);
            }}
            slide={slide}
            selectHandler={() => isSelected(answer)}
          />
        );
      case contentTypes.IMAGE:
        return (
          <ImageAnswer
            key={answer._id}
            image={getContentByType(answer.items, contentTypes.IMAGE)}
            isCorrect={correct}
            isSelected={selected}
            isMultiAnswer={multi}
            clickHandler={() => {
              doAnswer(answer);
            }}
            slide={slide}
            selectHandler={() => isSelected(answer)}
          />
        );
      case contentTypes.AUDIOCOVER:
        return (
          <CoverAnswer
            key={answer._id}
            answer={answer}
            isCorrect={correct}
            isSelected={selected}
            isMultiAnswer={multi}
            image={getContentByType(answer.items, contentTypes.IMAGE).value}
            audio={getContentByType(answer.items, contentTypes.AUDIO).value}
            clickHandler={() => {
              doAnswer(answer);
            }}
            slide={slide}
            selectHandler={() => isSelected(answer)}
          />
        );
      case contentTypes.VIDEO:
        return (
          <VideoAnswer
            key={answer._id}
            answer={answer}
            isCorrect={correct}
            isSelected={selected}
            isMultiAnswer={multi}
            video={getContentByType(answer.items, contentTypes.VIDEO).value}
            clickHandler={() => {
              doAnswer(answer);
            }}
            slide={slide}
            selectHandler={() => isSelected(answer)}
          />
        );
      default:
        throw Error("Could not determine type of content for this answer");
    }
  };

  const renderAnswers = slide => {
    return slide.possibleAnswers.map(answer => [renderAnswer(answer, slide)]);
  };

  const isSelected = answer => {
    console.log(answer, "ANSWER", selectedAnswers);

    //    return selectedAnswers.findIndex(selected => selected === answer._id) > -1;
    return selectedAnswers.findIndex(selected => selected === answer._id);
  };

  const doAnswer = (answer, isMultiAnswer) => {
    // Toggle selected answer in list of selected answers
    const indexOfAnswer = isSelected(answer);
    if (!isMultiAnswer) {
      if (indexOfAnswer > -1) {
        setSelectedAnswers([]);
      } else {
        setSelectedAnswers([answer._id]);
      }
    } else {
      if (indexOfAnswer > -1) {
        selectedAnswers.splice(indexOfAnswer, 1);
        setSelectedAnswers([...selectedAnswers]);
      } else {
        setSelectedAnswers([...selectedAnswers, answer._id]);
      }
    }
  };

  const checkAnswerIsCorrect = (correctAnswers, answerId) => {
    return (
      correctAnswers.filter((correctAnswerId, index) => {
        return correctAnswerId === answerId;
      }).length > 0
    );
  };

  const checkAnswers = () => {
    if (!selectedAnswers) {
      return;
    }

    props.slideshowDispatch({
      type: "updateStates",
      payload: { index: props.index, states: [slideStates.GRADING_INPUT] }
    });

    const isAccepted =
      // If arrays are the same length and both contain the same values
      props.slide.correctAnswers.length === selectedAnswers.length &&
      // Compare every selected answer
      selectedAnswers.every(selectedAnswer =>
        // Check if selected answer is in list of possible answers
        checkAnswerIsCorrect(props.slide.correctAnswers, selectedAnswer)
      );

    httpService
      .post(`${apiUrl}/assignment/interaction/multiplechoice`, {
        slide: props.slide._id,
        answered: [...selectedAnswers],
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
              {renderAnswers(props.slide)}
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className={`${classes.section}`}>
              <div className={classes.sendButton}>
                <CustomSend
                  slideStates={props.slide.states}
                  isDisabled={
                    selectedAnswers.length === 0 ||
                    props.slide.states.includes(slideStates.DISPLAYING_FEEDBACK)
                  }
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

export default MultichoiceSlide;
