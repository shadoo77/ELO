import React from "react";
import PropTypes from "prop-types";
// Material UI
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Fab, Icon } from "@material-ui/core";
// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const useStyles = makeStyles((theme) =>
  createStyles({
    fab: {
      margin: theme.spacing(1)
    }
  })
);

const CustomButton = (props) => {
  const classes = useStyles();
  return (
    <Fab
      size={!props.fabSize ? "small" : props.fabSize}
      color={props.color ? props.color : "primary"}
      className={classes.fab}
      disabled={props.isDisabled ? props.isDisabled : false}
      onClick={props.clickHandler}
    >
      <FontAwesomeIcon
        icon={props.icon}
        style={{
          fontSize: props.iconSize ? props.iconSize : 20
          // color: `rgb(${props.iconColor})`
        }}
      />
    </Fab>
  );
};

CustomButton.propTypes = {
  clickHandler: PropTypes.func.isRequired
};

export default CustomButton;
