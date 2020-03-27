import React, { useState, useEffect, useRef } from "react";
import { DndProvider } from "react-dnd-cjs";
import MultiBackend from "react-dnd-multi-backend";
import HTML5toTouch from "react-dnd-multi-backend/lib/HTML5toTouch";
// Components
import {
  MultichoiceSlide,
  MatchingSlide,
  InfoSlide,
  FlashcardSlide
} from "./templates/index";
// Services
import { slideTypes } from "services/config";
// Material UI
import { createStyles, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() =>
  createStyles({
    slide: {
      // padding: 10,
      paddingBottom: 100
    }
  })
);

const Slide = (props) => {
  const classes = useStyles();

  const pickSlide = (slide) => {
    switch (slide.__t) {
      case slideTypes.MULTICHOICE:
        return (
          <MultichoiceSlide
            slide={props.slideshow.slides[props.index]}
            navState={props.navState}
            navDispatch={props.navDispatch}
            slideshowDispatch={props.slideshowDispatch}
            index={props.index}
            attempt={props.attempt}
          />
        );
      case slideTypes.MATCHING:
        return (
          <MatchingSlide
            slide={props.slideshow.slides[props.index]}
            navState={props.navState}
            navDispatch={props.navDispatch}
            slideshowDispatch={props.slideshowDispatch}
            index={props.index}
            attempt={props.attempt}
          />
        );
      case slideTypes.INPUT_WOORDEN:
      case slideTypes.INPUT_ZINNEN:
      case slideTypes.TAALBEAT:
        return (
          <FlashcardSlide
            slide={props.slideshow.slides[props.index]}
            navState={props.navState}
            navDispatch={props.navDispatch}
            slideshowDispatch={props.slideshowDispatch}
            index={props.index}
            attempt={props.attempt}
          />
        );
      case slideTypes.INFO:
      default:
        return (
          <InfoSlide
            slide={props.slideshow.slides[props.index]}
            navState={props.navState}
            navDispatch={props.navDispatch}
            slideshowDispatch={props.slideshowDispatch}
            index={props.index}
            attempt={props.attempt}
          />
        );
    }
  };

  return (
    <DndProvider backend={MultiBackend} options={HTML5toTouch}>
      <div className={classes.slide}>
        {pickSlide(props.slideshow.slides[props.index])}
      </div>
    </DndProvider>
  );
};

export default Slide;
