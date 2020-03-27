import React from "react";
import PropTypes from "prop-types";
// Material UI
import {
  createStyles,
  makeStyles
} from "@material-ui/core/styles";
import { Fab, Icon } from "@material-ui/core";

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      display: "inline-block"
    }
  })
);

const CustomFab = props => {
  const classes = useStyles();
  return (
    <Fab
      variant={props.variant ? props.variant : "round"}
      size={props.size ? props.size : "large"}
      color={props.color ? props.color : "primary"}
      type={props.type ? props.type : "button"}
      disabled={props.disabled ? props.disabled : false}
      onClick={props.clickHandler}
      classes={classes.root}
    >
      <Icon>{props.iconName}</Icon>
    </Fab>
  );
};

CustomFab.propTypes = {
  // clickHandler: PropTypes.func.isRequired,
  iconName: PropTypes.string.isRequired,
  // Optionals with default values for FAB API (@see: https://material-ui.com/api/fab)
  variant: PropTypes.oneOf(["round", "extended"]),
  color: PropTypes.oneOf(["primary", "secondary"]),
  disabled: PropTypes.oneOf([true, false]),
  type: PropTypes.oneOf(["submit", "reset", "button"])
};

export default CustomFab;
