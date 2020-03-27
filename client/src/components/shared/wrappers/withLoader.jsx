import React from "react";
import PropTypes from "prop-types";
// Components
import Spinner from "components/shared/spinner";

const withLoader = WrappedComponent => {
  // Return function
  const wrappedLoader = ({ isLoading, ...props }) =>
    isLoading ? (
      <Spinner />
    ) : (
      <WrappedComponent {...props} />
    );
  // Make sure we have access to props
  wrappedLoader.propTypes = {
    isLoading: PropTypes.bool.isRequired
  };
  // Return
  return wrappedLoader;
};

withLoader.propTypes = {
  WrappedComponent: PropTypes.elementType.isRequired
};

export default withLoader;
