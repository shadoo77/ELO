import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
// Components
import TagCard from "./tagCard";
// Services
import { routeUrls, tagLevels } from "services/config";
// Material UI
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";

const useStyles = makeStyles((theme) => createStyles({}));

const AssignmentBrowser = (props) => {
  const classes = useStyles();

  const renderChildNodes = () => {
    // Return components for each child
    return props.currentNodes.map((child) => {
      // const url =
      //   child.model.children.length > 0
      //     ? `${routeUrls.student.browse.tag}/${child.model._id}`
      //     : `${routeUrls.student.browse.paragraph}/${child.model._id}`;
      const url =
        child.model.tag.__t === tagLevels.ASSIGNMENT
          ? `${routeUrls.student.browse.assignment}/${child.model.tag._id}`
          : `${routeUrls.student.browse.tag}/${child.model.tag._id}`;
      return (
        <Grid key={`TagCardGrid_${child.model.tag._id}`} item xs={6} sm={3}>
          <TagCard
            url={url}
            icon={child.model.tag.icon}
            color={child.model.tag.color}
            depthLevel={child.model.tag.__t}
            progress={child.model.correct}
          />
        </Grid>
      );
    });
  };

  return (
    <Grid container spacing={2}>
      {props.currentNodes && renderChildNodes()}
    </Grid>
  );
};

export default withRouter(AssignmentBrowser);
