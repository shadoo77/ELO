import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

// Data
import { useResource } from "rest-hooks";
// Shapes
import ParagraphStatsResource from "shapes/~stats.paragraph";

// Components

// Services
import { backendService } from "services/backend";
import { LevelsOfNodeDepth } from "services/config";
// Material UI
import {
  createStyles,
  makeStyles
} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => createStyles({}));

function ParagraphStats(props) {
  const classes = useStyles();
  console.log("RENDERIGN PAR STATS");
  const interactions = useResource(
    ParagraphStatsResource.listShape(),
    {
      parentId: props.currentParentId
    }
  );

  useEffect(() => {
    console.log(interactions);
  }, [interactions]);

  return null;
}
export default ParagraphStats;
