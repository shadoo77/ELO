import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
// Services
import { routeUrls } from "services/config";
// Components
import Warner from "../warner";
// Material Ui components
import {
  CircularProgress,
  Paper,
  Typography,
  Link,
  Breadcrumbs
} from "@material-ui/core/";

import { historyService } from "services/history";
import { getBreadCrumbsValues } from "services/searchInTree";

const paperStyle = {
  width: "100%",
  margin: "3px auto",
  padding: "10px",
  textAlign: "center"
};

class BreadCrumbs extends Component {
  spinner = () => {
    return (
      <Paper style={paperStyle}>
        <CircularProgress />
      </Paper>
    );
  };
  // when the progress is empty
  emptyRow = () => {
    return <Paper style={paperStyle}>Geen vragen in database!</Paper>;
  };

  warner = () => {
    return (
      <Paper style={paperStyle}>
        <Warner message={this.props.errormessage} />
      </Paper>
    );
  };

  handleClick = id => {
    const { studentId } = this.props;
    if (id === "5ce26f814d65de88b425f250") {
      historyService.push(`${routeUrls.teacher.student.status}/${studentId}`);
    } else {
      historyService.push(
        `${routeUrls.teacher.student.status}/${studentId}/parent/${id}`
      );
    }
  };

  renderBreadcrumbs(data) {
    return data.map((el, i) => {
      return i === data.length - 1 ? (
        <Typography color="textPrimary" key={el.id + "bread"}>
          {el.value}
        </Typography>
      ) : (
        <Link
          color="inherit"
          component="button"
          variant="body2"
          onClick={() => this.handleClick(el.id)}
          key={el.id + "bread"}
        >
          {el.value}
        </Link>
      );
    });
  }
  /////////////////////////////////////////////////

  render() {
    const { tree, slideshows, parentId } = this.props;
    let breadcrumbsLinks = getBreadCrumbsValues(tree, parentId);
    if (!breadcrumbsLinks.length && slideshows.length === 1) {
      if (slideshows[0].entrypoint) {
        breadcrumbsLinks = getBreadCrumbsValues(
          tree,
          slideshows[0].entrypoint._id
        );
      }
    }

    return (
      <Breadcrumbs aria-label="Breadcrumb" style={{ margin: 10 }}>
        {this.renderBreadcrumbs(breadcrumbsLinks)}
      </Breadcrumbs>
    );
  }
}

BreadCrumbs.propTypes = {
  tree: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  const { isLoading, hasFailed, currentParent, tree, message } = state.tree;
  const slideshows = state.slideshows.data.items;
  return {
    isLoading,
    hasFailed,
    currentParent,
    tree,
    message,
    slideshows
  };
};

export default connect(
  mapStateToProps,
  null
)(BreadCrumbs);
