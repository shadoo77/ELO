import React from "react";

const Warner = ({ message }) => {
  return (
    <div className="alert alert-warning" role="alert">
      <i className="material-icons">info</i>
      {message}
    </div>
  );
};

export default Warner;
