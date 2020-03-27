import React from "react";
import PropTypes from "prop-types";
// Components
import Spinner from "components/shared/spinner";
import Warner from "components/shared/warner";

const withFetch = WrappedComponent => {
  // Return function
  const wrappedLoader = ({
    isLoading,
    hasFailed,
    errorMessage,
    ...props
  }) =>
    // Loading status
    isLoading && !hasFailed ? (
      <Spinner />
    ) : // Failed status
    !isLoading && hasFailed ? (
      <Warner message={errorMessage} />
    ) : (
      // Succeed status
      !isLoading &&
      !hasFailed && <WrappedComponent {...props} />
    );
  // Make sure we have access to props
  wrappedLoader.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    hasFailed: PropTypes.bool.isRequired,
    errorMessage: PropTypes.string.isRequired
  };
  // Return
  return wrappedLoader;
};

withFetch.propTypes = {
  WrappedComponent: PropTypes.elementType.isRequired
};

export default withFetch;
