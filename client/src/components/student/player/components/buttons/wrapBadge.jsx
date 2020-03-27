import React from "react";
import PropTypes from "prop-types";
// Material UI
import {
  createStyles,
  makeStyles
} from "@material-ui/core/styles";
import { Badge } from "@material-ui/core";

const useStyles = makeStyles(theme =>
  createStyles({ root: { display: "inline-block" } })
);

const WrapBadge = props => {
  const classes = useStyles();
  return (
    <Badge
      badgeContent={props.content}
      color={props.color ? props.color : "seconday"}
      overlap="circle"
      className={classes.root}
    >
      {props.children}
    </Badge>
  );
};

WrapBadge.propTypes = {
  content: PropTypes.string.isRequired, // Todo: Could be a component
  color: PropTypes.string
};

export default WrapBadge;
