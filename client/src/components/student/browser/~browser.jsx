import React, { useState, useEffect } from "react";
import { useResource } from "rest-hooks";
import { withRouter } from "react-router-dom";
// Shapes
import ProgressResource from "shapes/progress.student.overview.shape";
// Components
import Header from "./components/header";
import ThemeBrowser from "./components/theme";
import ParagraphBrowser from "./components/paragraph";
import AssignmentBrowser from "./components/assignment";
// Services
import { tagLevels, difficultyTypes } from "services/config";
import { userService } from "services/user";
// Material UI
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Fade from "@material-ui/core/Fade";

const useStyles = makeStyles((theme) =>
  createStyles({
    outerHeader: {
      padding: "12px 3px 0 3px",
      width: "100%",
      backgroundColor: ({ bgColor }) => `rgb(${bgColor})`,
      transition: ({ bgColor }) =>
        `background-color .44s ${
          bgColor === "250,250,250" ? "ease-out" : "ease-in"
        }`,
      color: "white"
    },
    innerHeader: {
      borderTopRightRadius: "6px",
      borderTopLeftRadius: "6px",
      backgroundColor: "rgb(250, 250, 250)",
      width: "100%",
      padding: "1.5em",
      display: "-webkit-flex",
      flexWrap: "wrap",
      flexDirection: "row",
      justifyContent: "start",
      alignItems: "start",
      alignContent: "start"
    },
    outerContent: {
      padding: "0 3px 3px 3px",
      width: "100%",
      backgroundImage: ({ bgColor }) =>
        `linear-gradient(rgb(${bgColor}) 0%, rgb(250, 250, 250) 20%)`,
      transition: ({ bgColor }) =>
        `background-image .44s ${
          bgColor === "250,250,250" ? "ease-out" : "ease-in"
        }`
    },
    innerContent: {
      backgroundColor: "rgb(250, 250, 250)",
      width: "100%",
      padding: "1em 1em 60px 1em",
      borderTop: "1px solid rgba(0,0,0,0.2)"
    }
  })
);

const themeNodes2 = (progress) => {
  const diff1 = progress.data.themes.filter(
    (theme) => theme.tag.difficulty === difficultyTypes.BEGINNER
  );

  const diff2 = progress.data.themes.filter(
    (theme) => theme.tag.difficulty === difficultyTypes.INTERMEDIATE
  );

  const diff3 = progress.data.themes.filter(
    (theme) => theme.tag.difficulty === difficultyTypes.ADVANCED
  );

  return [diff1, diff2, diff3];
};

const paragraphNodes2 = (progress) => {
  return progress.data.paragraphs;
};

const assignmentNodes2 = (progress, parentId) => {
  return progress.data.assignments.filter(
    (assignment) => assignment.parent === parentId
  );
};

const SlideshowBrowser = (props) => {
  // const [treeNodes, setTreeNodes] = useState(null);

  const userId = userService.getCurrentUserId();
  const parentId =
    typeof props.match.params.parentId === "undefined"
      ? "5ce26f814d65de88b425f250"
      : props.match.params.parentId;
  const depthLevel = props.match.params.depthLevel;

  const progress = useResource(ProgressResource.detailShape(), {
    userId,
    parentId,
    depthLevel
  });

  const [themeColor, setThemeColor] = useState("250,250,250");
  const [pathNodes, setPathNodes] = useState(null);
  const classes = useStyles({ bgColor: themeColor });
  const [currentNodes, setCurrentNodes] = useState();

  const [themeNodes, setThemeNodes] = useState([]);
  const [paragraphNodes, setParagraphNodes] = useState([]);
  const [assignmentNodes, setAssignmentNodes] = useState([]);

  const processNodes = (progress, depthLevel, parentId) => {
    switch (depthLevel.toUpperCase()) {
      case tagLevels.PUBLICATION:
        return setThemeNodes(themeNodes2(progress));
      case tagLevels.THEME:
        return setParagraphNodes(paragraphNodes2(progress));
      case tagLevels.PARAGRAPH:
        return setAssignmentNodes(assignmentNodes2(progress, parentId));
      case tagLevels.ASSIGNMENT:
        return progress;
      default:
        throw Error("AGJNGLGNHGJUEGUT");
    }
  };

  useEffect(() => {
    // Find current nodes to render!
    processNodes(progress, depthLevel, parentId);

    // setPathNodes([progress.data.publication]);

    // // Find breadcrumbs!
    // const pathNodes = foundNodes.length >= 1 ? foundNodes[0].getPath() : [];
    // setPathNodes(pathNodes);

    // // Update theme color!
    // if (pathNodes.length > 2) {
    //   const parentTheme = pathNodes.find(
    //     (parent) => parent.model.tag.__t === tagLevels.THEME
    //   );
    //   setThemeColor(parentTheme.model.tag.color);
    // } else {
    //   setThemeColor("250,250,250");
    // }
  }, [progress]);

  const pickBrowser = (depthLevel) => {
    switch (depthLevel.toUpperCase()) {
      case tagLevels.PUBLICATION:
        return themeNodes ? (
          <ThemeBrowser
            themeNodes={themeNodes}
            setCurrentNodes={setCurrentNodes}
          />
        ) : null;
      case tagLevels.THEME:
        return paragraphNodes ? (
          <ParagraphBrowser
            paragraphNodes={paragraphNodes}
            setCurrentNodes={setCurrentNodes}
          />
        ) : null;
      case tagLevels.PARAGRAPH:
        return <AssignmentBrowser assignmentNodes={assignmentNodes} />;
      default:
        console.error("DEFAULT pickBrowser");
        return null;
    }
  };

  return (
    <>
      <div>
        <div className={classes.outerHeader}>
          <div className={classes.innerHeader}>
            {pathNodes && <Header pathNodes={pathNodes} />}
          </div>
        </div>
        <div className={classes.outerContent}>
          <Fade in={!pathNodes.length > 0}>
            <div className={classes.innerContent}>
              {pickBrowser(depthLevel)}
            </div>
          </Fade>
        </div>
      </div>
    </>
  );
};

export default withRouter(SlideshowBrowser);
