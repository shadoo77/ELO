import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { useInvalidator } from "rest-hooks";
// Shapes
import AssignmentResource from "shapes/assignment.shape";
// Components
import { CustomButton } from "./../components/buttons/";
// Helpers
import { apiUrl, routeUrls, tagLevels } from "services/config";
import { httpService } from "services/http";
import { findLastInteraction, isAnswerAccepted } from "./utils/slideManagement";
// Material UI
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faAngleRight,
  faSyncAlt,
  faSmile,
  faFrown,
  faExclamationCircle
} from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      textAlign: "center"
    },
    section: {},
    sectionAnswers: {
      // padding: "1em 0",
      display: "flex"
    }
  })
);

const InfoSlide = (props) => {
  const classes = useStyles();
  const [url, setUrl] = useState();
  const invalidate = useInvalidator(AssignmentResource.detailShape());

  useEffect(() => {}, [props.hasFocus]);

  const pickIcon = (icon) => {
    switch (icon) {
      case true:
        return faSmile;
      case false:
        return faFrown;
      case "error":
      default:
        return faExclamationCircle;
    }
  };

  const pickColor = (icon) => {
    switch (icon) {
      case true:
        return "rgb(72,182,72)";
      case false:
        return "rgb(203,32,38)";
      case "error":
      default:
        return "rgb(224,163,42)";
    }
  };

  const renderFeedback = (slide) => {
    const lastInteraction = slide.interactions[props.attempt];
    const isCorrect =
      typeof lastInteraction !== "undefined"
        ? lastInteraction.isAccepted
        : "error";

    return (
      <p
        key={`feedback_slide_${slide._id}`}
        style={{ fontSize: "28px", lineHeight: "28px" }}
      >
        {slide.name}:{" "}
        <FontAwesomeIcon
          icon={pickIcon(isCorrect)}
          style={{
            color: pickColor(isCorrect),
            fontSize: 28
          }}
        />
      </p>
    );
  };

  const renderReport = (slideshow) => {
    return slideshow.slides.map((slide) => renderFeedback(slide));
  };

  const renderNavOptions = (slideshow) => {
    return (
      <>
        <CustomButton
          className={classes.flexButton}
          icon={faSyncAlt}
          iconSize="18"
          color="secondary"
          clickHandler={() => {
            if (props.hasFocus) {
              httpService
                .post(`${apiUrl}/assignment/progress/update`, {
                  themeId: props.slideshow.parent.parent,
                  paragraphId: props.slideshow.parent._id,
                  assignmentId: props.slideshow._id,
                  slides: props.slideshow.slides
                })
                .then((response) => {
                  setUrl(response.data._url);
                })
                .catch((ex) => {
                  console.error("Could not save progress!", ex);
                });
            }
          }}
        />
        <CustomButton
          className={classes.flexButton}
          icon={faTimes}
          iconSize="26"
          color="secondary"
          clickHandler={() => {
            props.history.push(
              `${routeUrls.student.browse.tag}/theme/${props.slideshow.parent.parent}/paragraph/${props.slideshow.parent._id}`
            );
          }}
        />
        <CustomButton
          className={classes.flexButton}
          icon={faAngleRight}
          iconSize="26"
          color="secondary"
          clickHandler={() => {
            invalidate({
              _id: props.slideshow._id
            });
            props.history.push(url);
          }}
        />
      </>
    );
  };

  return (
    <>
      <Grid container className={classes.container}>
        <Grid item xs={12}>
          <p>Work in Progress!</p>
          <div className={classes.section}>{renderReport(props.slideshow)}</div>
        </Grid>
        <Grid item xs={12}>
          <div className={classes.section}>
            {props.hasFocus && renderNavOptions(props.slideshow)}
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default withRouter(InfoSlide);
