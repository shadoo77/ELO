import React, { useState, useEffect, useRef } from "react";
import { useResource, useInvalidator } from "rest-hooks";
import { withRouter } from "react-router-dom";
// Shapes
import ProgressResource from "shapes/progress.student.overview.shape";
// Components
import TagCard from "./components/tagCard";
import ExpandedRow from "./components/ExpandedRow";
import Header from "./components/header";
import ThemeBrowser from "./components/theme";
import ParagraphBrowser from "./components/paragraph";
import AssignmentBrowser from "./components/assignment";
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
    "@keyframes FadeIn": {
      "0%": {
        marginTop: "-8px",
        opacity: 0
      },
      "100%": {
        marginTop: 0,
        opacity: 1
      }
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
    innerHeader: {
      display: "flex",
      width: "100%",
      animationDelay: ".22s",
      animationFillMode: "both",
      animationDuration: ".22s",
      animationTimingFunction: "ease-out",
      animationIterationCount: "1",
      animationName: "$FadeIn"
    },
    headerAnim: {
      animationFillMode: "both",
      animationDuration: ".22s",
      animationTimingFunction: "ease-in",
      animationIterationCount: "1",
      animationName: "$SlideUp"
    },
    contentAnim: {
      animationDelay: ".22s",
      animationFillMode: "both",
      animationDuration: ".12s",
      animationTimingFunction: "ease-out",
      animationIterationCount: "1",
      animationName: "$SlideUp"
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
    }
  })
);

const NodeBrowser = props => {
  const { themeId, parId } = props.match.params;
  const depthLevel =
    typeof props.match.params.parId === "undefined"
      ? tagLevels.THEME
      : tagLevels.PARAGRAPH;
  const parentId = depthLevel === tagLevels.THEME ? themeId : parId;
  const userId = userService.getCurrentUserId();

  const [currentNodes, setCurrentNodes] = useState();
  const [pathNodes, setPathNodes] = useState(null);
  const [currentDepth, setCurrentDepth] = useState(depthLevel);
  const latestDepth = useRef();
  const invalidate = useInvalidator(ProgressResource.detailShape());

  const progress = useResource(ProgressResource.detailShape(), {
    userId,
    parentId: themeId,
    depthLevel: currentDepth
  });

  const classes = useStyles({
    bgColor:
      currentNodes && currentNodes.length > 0
        ? currentNodes[0].tag.color
        : "rgb(255, 0 ,0 )",
    depthLevel
  });

  function cleanUp() {
    if (latestDepth.current === tagLevels.THEME) {
      invalidate({
        userId,
        parentId: themeId,
        depthLevel: currentDepth
      });
    }
  }

  useEffect(() => cleanUp, []);

  useEffect(() => {
    latestDepth.current =
      typeof props.match.params.parId === "undefined"
        ? tagLevels.THEME
        : tagLevels.PARAGRAPH;
    setCurrentDepth(
      typeof props.match.params.parId === "undefined"
        ? tagLevels.THEME
        : tagLevels.PARAGRAPH
    );
  }, [parId]);

  useEffect(() => {
    console.log("DATA", progress.data);
    if (currentDepth === tagLevels.THEME) {
      setCurrentNodes(progress.data.paragraphs);
      setPathNodes([progress.data.publication, progress.data.parent]);
    } else if (currentDepth === tagLevels.PARAGRAPH) {
      setCurrentNodes(
        progress.data.assignments.filter(
          assignment => assignment.tag.parent === parentId
        )
      );
      setPathNodes([
        progress.data.publication,
        progress.data.parent,
        progress.data.paragraphs.filter(par => par.tag.parent === parentId)
      ]);
    }
  }, [progress]);

  const pickUrl = node => {
    switch (currentDepth) {
      case tagLevels.PARAGRAPH:
        return `${routeUrls.student.browse.tag}/theme/${themeId}/paragraph/${parId}/assignment/${node.tag._id}`;
      case tagLevels.THEME:
      default:
        return `${routeUrls.student.browse.tag}/theme/${themeId}/paragraph/${node.tag._id}`;
    }
  };

  const renderChildNodes = node => {
    console.log(currentNodes);
    const icons = currentNodes.reduce((a, b) => a.concat(b.tag.icon), []);

    return (
      <Grid
        key={`TagCardGrid_${currentDepth}_${node.tag._id}`}
        item
        xs={6}
        sm={4}
      >
        <TagCard
          url={pickUrl(node)}
          icon={node.tag.icon}
          color={node.tag.color}
          depthLevel={node.tag.__t}
          correct={
            node.tag.__t === tagLevels.ASSIGNMENT
              ? node.lastCorrect
              : node.correct
          }
          wrong={
            node.tag.__t === tagLevels.ASSIGNMENT ? node.lastWrong : node.wrong
          }
          icons={[...new Set(icons)]}
        />
      </Grid>
    );
  };

  return (
    <>
      <div>
        <div className={`${classes.outerHeader} ${classes.headerAnim}`}>
          {pathNodes && (
            <div className={classes.innerHeader}>
              <Header pathNodes={pathNodes} />
            </div>
          )}
        </div>
        <div className={`${classes.outerContent} ${classes.contentAnim}`}>
          <div className={classes.innerContent}>
            {currentNodes && (
              <Fade in={currentNodes.length > 0}>
                <Grid key={`nodeGrid_${currentDepth}`} container spacing={2}>
                  {currentNodes.map((node, index) => renderChildNodes(node))}
                </Grid>
              </Fade>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default withRouter(NodeBrowser);
