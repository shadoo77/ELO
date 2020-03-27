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

const ParagraphBrowser = (props) => {
  const classes = useStyles();

  const renderTag = (child) => {
    return (
      <Grid key={`TagCardGrid_${child.tag._id}`} item xs={6} sm={4}>
        <TagCard
          url={`${routeUrls.student.browse.paragraph}/${child.tag._id}`}
          icon={child.tag.icon}
          depthLevel={child.tag.__t}
          progress={child.correct}
        />
      </Grid>
    );
  };

  const renderNodes = (paragraphs) => {
    return (
      <Grid container spacing={2}>
        {paragraphs.map((paragraph) => renderTag(paragraph))}
      </Grid>
    );
  };

  return <>{props.paragraphNodes && renderNodes(props.paragraphNodes)}</>;
};

export default withRouter(ParagraphBrowser);
