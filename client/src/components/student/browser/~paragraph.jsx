import React, { useState, useEffect } from "react";
import { useResource } from "rest-hooks";
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

const PublicationBrowser = (props) => {
  const classes = useStyles();

  const userId = userService.getCurrentUserId();
  const parentId = props.parentId;
  const depthLevel = tagLevels.PARAGRAPH;

  const progress = useResource(ProgressResource.detailShape(), {
    userId,
    parentId,
    depthLevel
  });

  useEffect(() => {
    // const assignments = progress.data.assignments.filter(
    //   (assignment) => assignment.tag.parent === parentId
    // );
    
    //setCurrentNodes(assignments);
  }, [progress]);

  const [currentNodes, setCurrentNodes] = useState();
  const [currentPath, setCurrentPath] = useState();

  const renderChildNodes = (assignment) => {
    return (
      <Grid key={`TagCardGrid_par_${assignment.tag._id}`} item xs={4} sm={3}>
        <TagCard
          url={`${
            routeUrls.student.browse.tag
          }/${tagLevels.ASSIGNMENT.toLowerCase()}/${assignment.tag._id}`}
          icon={assignment.tag.icon}
          color={assignment.tag.color}
          depthLevel={assignment.tag.__t}
          progress={assignment.correct}
        />
      </Grid>
    );
  };

  return (
    <>
      {currentNodes &&
        currentNodes.map((assignment, index) => (
          <Grid key={`assignGrid_${index}`} container spacing={2}>
            {renderChildNodes(assignment)}
          </Grid>
        ))}
    </>
  );
};

export default withRouter(PublicationBrowser);
