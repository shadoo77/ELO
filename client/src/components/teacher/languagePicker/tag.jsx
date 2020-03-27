import React from "react";
import PropTypes from "prop-types";

const Tag = props => {
  return (
    <a
      id={props.id}
      name={props.name}
      href={"http://localhost:3000/tags/" + props.id}
      className="badge badge-primary p-2 m-1"
      onClick={props.onRemoveClick}
    >
      {props.name} <i className="fas fa-times-circle" />
    </a>
  );
};

Tag.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onRemoveClick: PropTypes.func.isRequired
};

export default Tag;
