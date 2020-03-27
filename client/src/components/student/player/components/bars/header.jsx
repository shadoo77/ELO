import React from "react";
import { withRouter } from "react-router-dom";
import { useInvalidator } from "rest-hooks";
// Shapes
import AssignmentResource from "shapes/assignment.shape";
// Components
import { CustomButton } from "../buttons";
// Services
import { routeUrls, slideStates, slideTypes } from "services/config";
// Material UI
import { createStyles, makeStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
// Icons
import {
  faAngleRight,
  faAngleLeft,
  faTimes
} from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles((theme) =>
  createStyles({
    flexButton: {
      flex: "0 0 auto"
    },
    outerHeader: {
      width: "100%",
      backgroundSize: "100% 0%",
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
      backgroundSize: "100% 0%",
      backgroundRepeat: "no-repeat",
      backgroundImage: ({ bgColor }) =>
        `linear-gradient(rgb(${bgColor}) 0%, rgb(${bgColor}) 100px, rgb(250, 250, 250) 200px)`
    },
    innerContent: {
      borderTopRightRadius: "6px",
      borderTopLeftRadius: "6px",
      backgroundColor: "rgb(250, 250, 250)",
      width: "100%",
      padding: "1em 1em 60px 1em",
      minHeight: "300px"
    },
    flexButton: {
      flex: "0 0 auto"
    },
    flexProgress: {
      flex: "1 1 auto",
      position: "relative"
    },
    progressBar: {
      height: 22,
      margin: 16,
      borderRadius: 12
    },
    progressText: {
      width: "100%",
      position: "absolute",
      color: "#fff",
      fontWeight: 600,
      fontSize: 16,
      textAlign: "center",
      transform: "translate(0%, -250%)"
    }
  })
);

const Header = (props) => {
  const classes = useStyles({ bgColor: props.slideshow.parent.color });
  const invalidate = useInvalidator(AssignmentResource.detailShape());

  const pickDisabled = () => {
    // Obviously we can't navigate out of range
    if (props.navState.slideWithFocus >= props.navState.nrOfSlides - 1) {
      return true;
    }
    // Logic depends on slidetype
    switch (props.slideshow.slides[props.navState.slideWithFocus].__t) {
      // Types of slides that need interaction before enabling navigation
      case slideTypes.MULTICHOICE:
        return !props.slideshow.slides[
          props.navState.slideWithFocus
        ].states.includes(slideStates.DISPLAYING_FEEDBACK);
      // Types of slides where navigation is enabled by default
      case slideTypes.INFO:
      case slideTypes.INPUT_WOORDEN:
      case slideTypes.INPUT_ZINNEN:
      default:
        return false;
    }
  };

  return (
    <>
      <CustomButton
        className={classes.flexButton}
        icon={faTimes}
        iconSize="26"
        color="secondary"
        clickHandler={() => {
          invalidate({
            _id: props.slideshow._id
          });

          props.history.push(
            `${routeUrls.student.browse.tag}/theme/${props.slideshow.parent.parent}/paragraph/${props.slideshow.parent._id}`
          );
        }}
      />

      <CustomButton
        className={classes.flexButton}
        icon={faAngleLeft}
        iconSize="32"
        color="secondary"
        isDisabled={props.navState.slideWithFocus <= 0}
        clickHandler={() => {
          props.navDispatch({ type: "previous" });
        }}
      />
      <div className={classes.flexProgress}>
        <LinearProgress
          className={classes.progressBar}
          variant="determinate"
          value={
            props.navState.slideWithFocus < props.navState.nrOfSlides - 1
              ? ((props.navState.slideWithFocus + 1) /
                  (props.navState.nrOfSlides - 1)) *
                100
              : 100
          }
          color="secondary"
        />
        {props.navState.slideWithFocus < props.navState.nrOfSlides - 1 && (
          <p className={classes.progressText}>
            {`${props.navState.slideWithFocus + 1} / ${props.navState
              .nrOfSlides - 1}`}
          </p>
        )}
      </div>
      <CustomButton
        className={classes.flexButton}
        icon={faAngleRight}
        iconSize="32"
        color="secondary"
        isDisabled={pickDisabled()}
        clickHandler={() => {
          props.navDispatch({ type: "next" });
        }}
      />
    </>
  );
};

export default withRouter(Header);
