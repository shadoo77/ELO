import React, { useEffect } from "react";
import PropTypes from "prop-types";
// Material UI
import {
  createStyles,
  makeStyles
} from "@material-ui/core/styles";
import FabButton from "components/shared/inputs/fabButton";

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
    <FabButton
      className={classes.root}
      clickHandler={props.clickHandler}
      icon={props.icon}
      progress={props.progress ? props.progress : null}
      loading={props.isLoading ? props.isLoading : false}
      disabled={props.isDisabled ? props.isDisabled : false}
      variant={props.variant ? props.variant : "round"}
    />
  );
};

CustomFab.propTypes = {
  clickHandler: PropTypes.func.isRequired,
  icon: PropTypes.object.isRequired,
  // Optionals with default values for FAB API (@see: https://material-ui.com/api/fab)
  variant: PropTypes.oneOf(["round", "extended"]),
  color: PropTypes.oneOf(["primary", "secondary"]),
  isDisabled: PropTypes.oneOf([true, false]),
  isLoading: PropTypes.oneOf([true, false]),
  type: PropTypes.oneOf(["submit", "reset", "button"])
};

export default CustomFab;
