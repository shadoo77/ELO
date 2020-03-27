import React from "react";
import PropTypes from "prop-types";
// Material UI
import {
  createStyles,
  makeStyles
} from "@material-ui/core/styles";
import { Fab } from "@material-ui/core";

const useStyles = makeStyles(theme =>
  createStyles({
    fab: {
      margin: theme.spacing(1)
    }
  })
);

const CustomButtoContent = props => {
  const classes = useStyles();
  return (
    <Fab
      size="small"
      color={props.color ? props.color : "primary"}
      className={classes.fab}
      disabled={props.isDisabled ? props.isDisabled : false}
      onClick={props.clickHandler}
    >
      {props.content}
    </Fab>
  );
};

CustomButtoContent.propTypes = {
  clickHandler: PropTypes.func.isRequired
};

export default CustomButtoContent;
