import React from "react";
import PropTypes from "prop-types";
// Components
import Warner from "components/shared/warner";

const withError = WrappedComponent => {
  // Return function
  const wrappedLoader = ({ errorMessage, ...props }) =>
    errorMessage !== "" ? (
      <Warner message={errorMessage} />
    ) : (
      <WrappedComponent {...props} />
    );
  // Make sure we have access to props
  wrappedLoader.propTypes = {
    hasFailed: PropTypes.bool.isRequired,
    errorMessage: PropTypes.string.isRequired
  };
  // Return
  return wrappedLoader;
};

withError.propTypes = {
  WrappedComponent: PropTypes.elementType.isRequired
};

export default withError;
