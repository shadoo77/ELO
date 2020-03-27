import React from "react";
import PropTypes from "prop-types";
// Material UI
import { createStyles, makeStyles } from "@material-ui/core/styles";
// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckSquare,
  faSquare,
  faDotCircle,
  faCircle
} from "@fortawesome/fontawesome-free-regular";

const useStyles = makeStyles(theme =>
  createStyles({
    container: {
      position: "absolute",
      right: "4%",
      bottom: "4%"
    }
  })
);

const ToggleIcon = ({ type, isSelected }) => {
  const classes = useStyles();

  const pickIcon = () => {
    switch (type) {
      case "Radio":
        return isSelected ? faDotCircle : faCircle;
      case "Check":
      default:
        return isSelected ? faCheckSquare : faSquare;
    }
  };

  return (
    <div className={classes.container}>
      <FontAwesomeIcon
        icon={pickIcon()}
        style={{
          fontSize: 40
        }}
      />
    </div>
  );
};

ToggleIcon.propTypes = {
  type: PropTypes.oneOf(["Radio", "Check"])
};

export default ToggleIcon;
