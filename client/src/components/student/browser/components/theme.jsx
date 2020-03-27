import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
// Components
import TagCard from "./tagCard";
import ExpandedRow from "./ExpandedRow";
// Services
import { routeUrls, tagLevels } from "services/config";
// Material UI
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Grid, Box } from "@material-ui/core";
// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/fontawesome-free-regular";
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles((theme) =>
  createStyles({
    difficultySection: {
      marginTop: 24,
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
  })
);

const ThemeBrowser = (props) => {
  const classes = useStyles();

  const renderChildNodes = (difficulty) => {
    // Return components for each child
    return difficulty.map((child) => {
      return (
        <Grid key={`TagCardGrid_${child.tag._id}`} item xs={6} sm={3}>
          <TagCard
            url={`${routeUrls.student.browse.theme}/${child.tag._id}`}
            icon={child.tag.icon}
            color={child.tag.color}
            depthLevel={child.tag.__t}
            progress={child.correct}
          />
        </Grid>
      );
    });
  };

  const renderStars = (index) => {
    const stars = [];
    for (let i = 0; i < 3; i++) {
      stars.push(
        <FontAwesomeIcon
          key={`diffStars_${index}_${i}`}
          icon={i <= index ? faStarSolid : faStar}
          style={{
            fontSize: 25,
            color: "#e0a32a",
            transform: "scaleX(-1)"
          }}
        />
      );
    }
    return stars;
  };

  return (
    <>
      {props.themeNodes &&
        props.themeNodes.map((difficulty, index) => (
          <div className={classes.difficultySection}>
            <ExpandedRow header={renderStars(index)}>
              <Grid key={`diffGrid_${index}`} container spacing={2}>
                {renderChildNodes(difficulty)}
              </Grid>
            </ExpandedRow>
          </div>
        ))}
    </>
  );
};

export default withRouter(ThemeBrowser);
