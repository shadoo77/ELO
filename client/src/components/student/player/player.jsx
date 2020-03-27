import React, { useEffect, useReducer } from "react";
import { useResource, useInvalidator } from "rest-hooks";
// Shapes
import AssignmentResource from "shapes/assignment.shape";
import ProgressResource from "shapes/progress.student.overview.shape";
// Components
import Slide from "./slide";
import Header from "./components/bars/header";
import Report from "./templates/report";
// Services
import { slideStates, slideTypes, tagLevels } from "services/config";
import { userService } from "services/user";
// Material UI
import { makeStyles } from "@material-ui/core/styles";
import Fade from "@material-ui/core/Fade";
// Swipe
import SwipeableViews from "react-swipeable-views";
import Preview from "react-dnd-preview";

function navReducer(state, action) {
  switch (action.type) {
    case "next":
      return { ...state, slideWithFocus: state.slideWithFocus + 1 };
    case "previous":
      return { ...state, slideWithFocus: state.slideWithFocus - 1 };
    case "update":
      return { ...state, slideWithFocus: action.newFocus };
    case "init":
      return {
        ...state,
        slideWithFocus: action.index,
        nrOfSlides: action.newTotal + 1 // + 1 for report
      };
    default:
      throw new Error();
  }
}

function updateSlideFocus(slide, index, action) {
  const newStates = slide.states.filter(
    state => state !== slideStates.OUT_OF_FOCUS
  );
  return {
    ...slide,
    states:
      index === action.newFocus
        ? newStates
        : [...newStates, slideStates.OUT_OF_FOCUS]
  };
}

function slidesReducer(state, action) {
  switch (action.type) {
    case "addInteraction":
      return {
        ...state,
        slides: state.slides.map((slide, index) => {
          return index === action.payload.index
            ? {
                ...slide,
                interactions: [
                  ...slide.interactions,
                  action.payload.interaction.data
                ],
                states: [slideStates.DISPLAYING_FEEDBACK]
              }
            : slide;
        })
      };
    case "updateStates":
      return {
        ...state,
        slides: state.slides.map((slide, index) =>
          index === action.payload.index
            ? { ...slide, states: action.payload.states }
            : slide
        )
      };
    case "updateProgress":
      return {
        ...state,
        slides: state.slides.map((slide, index) =>
          index === action.payload.index
            ? { ...slide, states: action.payload.states }
            : slide
        )
      };
    case "updateFocus":
      return {
        ...state,
        slides: state.slides.map((slide, index) =>
          updateSlideFocus(slide, index, action)
        )
      };
    case "init":
      return {
        ...action.slideshow,
        attempt: action.attempt,
        slides: action.slideshow.slides.map(slide => {
          return {
            ...slide,
            states:
              typeof slide.interactions[action.attempt] === "undefined"
                ? [slideStates.OUT_OF_FOCUS, slideStates.AWAITING_INPUT]
                : [slideStates.OUT_OF_FOCUS, slideStates.DISPLAYING_FEEDBACK]
          };
        })
      };
    default:
      throw new Error();
  }
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  "@keyframes FadeIn": {
    "0%": {
      marginTop: "-6px",
      opacity: 0
    },
    "100%": {
      marginTop: 0,
      opacity: 1
    }
  },
  outerContainer: {
    width: "3px",
    flex: "0 1",
    height: 300,
    backgroundImage: ({ bgColor }) =>
      `linear-gradient(rgb(${bgColor}) 0%, rgb(250, 250, 250) 20%)`
  },
  innerContainer: {
    backgroundColor: "rgb(250, 250, 250)",
    flex: "1 1",
    padding: "1em 1em 60px 1em"
  },
  innerHeader: {
    display: "flex",
    width: "100%",
    animationFillMode: "both",
    animationDuration: ".22s",
    animationTimingFunction: "ease-out",
    animationIterationCount: "1",
    animationName: "$FadeIn"
  },
  outerHeader: {
    width: "100%",
    backgroundSize: "100% 100%",
    backgroundRepeat: "no-repeat",
    backgroundImage: ({ bgColor }) =>
      `linear-gradient(rgb(${bgColor}) 0%, rgb(${bgColor}) 100%)`,
    color: "white",
    padding: "1.5em",
    display: "-webkit-flex",
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "start",
    alignItems: "start",
    alignContent: "start",
    minHeight: "98px"
  },

  outerContent: {
    padding: "0 3px 3px 3px",
    width: "100%",
    backgroundSize: "100% 100%",
    backgroundRepeat: "no-repeat",
    backgroundImage: ({ bgColor }) =>
      `linear-gradient(rgb(${bgColor}) 0%, rgb(${bgColor}) 20px, rgb(250, 250, 250) 100px)`
  },
  innerContent: {
    borderTopRightRadius: "6px",
    borderTopLeftRadius: "6px",
    backgroundColor: "rgb(250, 250, 250)",
    width: "100%",
    // padding: "1em 1em 60px 1em",
    minHeight: "300px"
  },
  difficultySection: {
    marginBottom: 24,
    position: "relative",
    padding: 12,
    borderRadius: 4,
    border: "1px solid #cecece"
  },
  difficultyHeader: {
    backgroundColor: "rgb(250,250,250)",
    padding: "8px 22px",
    position: "absolute",
    marginTop: -4,
    left: "4%",
    transform: "translate(0,-100%)"
  }
}));

const SlideshowPlayer = props => {
  const resource = useResource(AssignmentResource.detailShape(), {
    _id: props.match.params.assignmentId
  });
  const invalidateAssignment = useInvalidator(AssignmentResource.detailShape());
  const invalidateProgress = useInvalidator(ProgressResource.detailShape());
  const [slideshow, slideshowDispatch] = useReducer(slidesReducer, null);

  const [navState, navDispatch] = useReducer(navReducer, {
    nrOfSlides: 0,
    slideWithFocus: 0
  });

  const classes = useStyles({
    bgColor: slideshow !== null ? slideshow.parent.color : "250,250,250"
  });

  useEffect(() => {
    console.log("INVALIDATING PLAYER");
    invalidateAssignment({
      _id: props.match.params.assignmentId
    });

    invalidateProgress({
      userId: userService.getCurrentUserId(),
      parentId: props.match.params.themeId,
      depthLevel: tagLevels.PARAGRAPH
    });
  }, []);

  useEffect(() => {
    navDispatch({
      type: "init",
      index: resource.active,
      newTotal: resource.assignment.slides.length
    });
    // Init slideshow data
    slideshowDispatch({
      type: "init",
      slideshow: resource.assignment,
      attempt: resource.attempt
    });
  }, [resource]);

  useEffect(() => {
    slideshowDispatch({
      type: "updateFocus",
      newFocus: navState.slideWithFocus
    });
  }, [navState]);

  // function handleStepChange(step) {
  //   navDispatch({ type: "update", newFocus: step });
  // }

  function renderSlide(index) {
    const slide =
      index < slideshow.slides.length ? slideshow.slides[index] : null;

    if (slide === null) {
      return (
        <Report
          key={`report_${slideshow._id}`}
          themeColor={slideshow.parent.color}
          assignmentId={slideshow._id}
          slideshow={slideshow}
          slideshowDispatch={slideshowDispatch}
          hasFocus={navState.slideWithFocus === navState.nrOfSlides - 1}
          attempt={slideshow.attempt}
        />
      );
    } else {
      return (
        <Slide
          key={`slide_${slide._id}`}
          index={index}
          slide={slide}
          slideshow={slideshow}
          slideshowDispatch={slideshowDispatch}
          navState={navState}
          navDispatch={navDispatch}
          attempt={slideshow.attempt}
        />
      );
    }
    // return [
    //   slideshow.slides.map((slide, index) => (
    //     <Slide
    //       key={`slide_${slide._id}`}
    //       index={index}
    //       slide={slide}
    //       slideshow={slideshow}
    //       slideshowDispatch={slideshowDispatch}
    //       navState={navState}
    //       navDispatch={navDispatch}
    //       attempt={slideshow.attempt}
    //     />
    //   )),
    //   <Report
    //     key={`report_${slideshow._id}`}
    //     themeColor={slideshow.parent.color}
    //     assignmentId={slideshow._id}
    //     slideshow={slideshow}
    //     slideshowDispatch={slideshowDispatch}
    //     hasFocus={navState.slideWithFocus === navState.nrOfSlides - 1}
    //     attempt={slideshow.attempt}
    //   />
    // ];
  }
  console.log("SLIDESHOW:", slideshow);
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div className={classes.outerHeader}>
        <div className={classes.innerHeader}>
          {slideshow !== null && navState.nrOfSlides > 0 && (
            <Header
              navState={navState}
              navDispatch={navDispatch}
              slideshow={slideshow}
            />
          )}
        </div>
      </div>
      {slideshow !== null && (
        <Fade in={slideshow.slides.length > 0}>
          <div className={classes.outerContent}>
            <div className={classes.innerContent}>
              <div>{renderSlide(navState.slideWithFocus)}</div>

              {/* <SwipeableViews
                index={navState.slideWithFocus}
                onChangeIndex={handleStepChange}
                enableMouseEvents={true}
                animateHeight={false}
                springConfig={{
                  duration: ".4s",
                  easeFunction: "linear",
                  delay: "0s"
                }}
              >
                {renderSlide()}
              </SwipeableViews> */}
            </div>
          </div>
        </Fade>
      )}
    </div>
  );
};

export default SlideshowPlayer;
