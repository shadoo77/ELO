import React, { useState, useEffect } from "react";
import { useResource } from "rest-hooks";
import { withRouter } from "react-router-dom";
// Shapes
import ProgressResource from "shapes/progress.student.overview.shape";
// Components
import TagCard from "./components/tagCard";
import ExpandedRow from "./components/ExpandedRow";
import Header from "./components/header";
// Services
import { routeUrls, tagLevels, difficultyTypes } from "services/config";
import { userService } from "services/user";
// Material UI
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import Fade from "@material-ui/core/Fade";
// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/fontawesome-free-regular";
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles(theme =>
  createStyles({
    "@keyframes SlideUp": {
      "0%": {
        backgroundSize: "100% 0%"
      },
      "100%": {
        backgroundSize: "100% 100%"
      }
    },
    innerHeader: {
      display: "flex",
      width: "100%"
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
    headerAnim: {
      animationDelay: ".22s",
      animationFillMode: "both",
      animationDuration: ".12s",
      animationTimingFunction: "ease-in",
      animationIterationCount: "1",
      animationDirection: "reverse",
      animationName: "$SlideUp"
    },
    contentAnim: {
      animationFillMode: "both",
      animationDuration: ".22s",
      animationTimingFunction: "ease-out",
      animationIterationCount: "1",
      animationDirection: "reverse",
      animationName: "$SlideUp"
    },
    outerContent: {
      padding: "0 3px 3px 3px",
      width: "100%",
      backgroundSize: "100% 100%",
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
  })
);

const PublicationBrowser = props => {
  const classes = useStyles({ bgColor: "148, 15, 115" });

  const depthLevel = tagLevels.PUBLICATION;
  const userId = userService.getCurrentUserId();
  const parentId =
    typeof props.match.params.pubId === "undefined"
      ? "5ce26f814d65de88b425f250"
      : props.match.params.pubId;

  const progress = useResource(ProgressResource.detailShape(), {
    userId,
    parentId,
    depthLevel
  });

  const [currentNodes, setCurrentNodes] = useState();
  const [pathNodes, setPathNodes] = useState();

  useEffect(() => {
    console.log("PROGRESS", progress);

    const diff1 = progress.data.themes.filter(
      theme => theme.tag.difficulty === difficultyTypes.BEGINNER
    );
    const diff2 = progress.data.themes.filter(
      theme => theme.tag.difficulty === difficultyTypes.INTERMEDIATE
    );
    const diff3 = progress.data.themes.filter(
      theme => theme.tag.difficulty === difficultyTypes.ADVANCED
    );
    setCurrentNodes([diff1, diff2, diff3]);
    setPathNodes([progress.data.publication]);
  }, [progress]);

  const renderChildNodes = difficulty => {
    return difficulty.map(child => {
      console.log("CHILD", child);
      return (
        <Grid key={`TagCardGrid_${child.tag._id}`} item xs={6} sm={4}>
          <TagCard
            url={`${
              routeUrls.student.browse.tag
            }/${tagLevels.THEME.toLowerCase()}/${child.tag._id}`}
            icon={child.tag.icon}
            color={child.tag.color}
            depthLevel={child.tag.__t}
            correct={child.correct + child.wrong}
            wrong={child.wrong}
          />
        </Grid>
      );
    });
  };

  const renderStars = index => {
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
      <div>
        <div className={`${classes.outerHeader} ${classes.headerAnim}`}>
          <div className={classes.innerHeader}>
            {pathNodes && <Header pathNodes={pathNodes} />}
          </div>
        </div>
        <div className={`${classes.outerContent} ${classes.contentAnim}`}>
          <div className={classes.innerContent}>
            {currentNodes &&
              currentNodes.map((difficulty, index) => (
                <Fade
                  key={`diffdiv_fade_${index}`}
                  in={currentNodes.length > 0}
                >
                  <div className={classes.difficultySection}>
                    <ExpandedRow header={renderStars(index)}>
                      <Grid key={`diffGrid_${index}`} container spacing={2}>
                        {renderChildNodes(difficulty)}
                      </Grid>
                    </ExpandedRow>
                  </div>
                </Fade>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default withRouter(PublicationBrowser);
