import React from "react";
import PropTypes from "prop-types";

const WrapCentered = props => {
  return (
    <div
      style={{
        position: "relative",
        overflow: "visible"
      }}
    >
      <div
        style={{
          zIndex: 99,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          position: "absolute"
        }}
      >
        {props.children}
      </div>
    </div>
  );
};

WrapCentered.propTypes = {
  children: PropTypes.object.isRequired,
  topOffset: PropTypes.string,
  leftOffset: PropTypes.string
};

export default WrapCentered;
