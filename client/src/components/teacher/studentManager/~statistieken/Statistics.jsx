import React, { Component } from "react";
import { connect } from "react-redux";
import { fetch_slideshows_of } from "../../../../store/actions/slideshows";

import PropTypes from "prop-types";
//import { answerTypes } from "../../../../services/config";
// Components
import Warner from "../../../shared/warner";
import BreadCrumbs from "./breadCrumbs";
// Material Ui components
import { Grid, CircularProgress, Paper } from "@material-ui/core/";
// Import contents of statistics
import SlideshowsStatistics from "./content/Slideshows";
import ParagrafStatistics from "./content/Paragraf";
import ThemaStatistics from "./content/Thema";
import DifficultyStatistics from "./content/Difficulty";
// Helpers
import { searchInTree } from "../../../../services/searchInTree";

const paperStyle = {
  width: "100%",
  margin: "3px auto",
  padding: "10px",
  textAlign: "center"
};

class Statistics extends Component {
  async componentDidMount() {
    const { student_id, parent_id } = this.props.match.params;
    this.props.fetch_slideshows_of(parent_id, student_id);
  }

  componentDidUpdate(prevProps) {
    const { student_id, parent_id } = this.props.match.params;
    if (
      prevProps.match.params.parent_id !== parent_id ||
      prevProps.match.params.student_id !== student_id ||
      (prevProps.match.params.parent_id !== parent_id &&
        prevProps.match.params.student_id !== student_id)
    ) {
      this.props.fetch_slideshows_of(parent_id, student_id);
    }
  }

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

  contentSwitch = (items, tree, depthLevel) => {
    if (depthLevel === "slideshows") {
      return <SlideshowsStatistics slideshows={items || []} />;
    } else if (depthLevel === "paragraf") {
      return <ParagrafStatistics slideshows={items || []} />;
    } else if (depthLevel === "thema") {
      return (
        <ThemaStatistics
          themaId={this.props.match.params.parent_id}
          slideshows={items || []}
          tree={tree}
        />
      );
    } else if (depthLevel === "difficulty") {
      return (
        <DifficultyStatistics
          diffId={this.props.match.params.parent_id}
          slideshows={items || []}
          tree={tree}
        />
      );
    } else {
      return <h2 style={{ color: "red" }}>NOT FOUND</h2>;
    }
  };

  render() {
    const { items, isLoading, hasFailed, tree } = this.props;
    const { student_id, parent_id } = this.props.match.params;
    // Get depthLevel of an item to indicate the contents which we want to show
    // e.g : if depthLevel is thema , then we'll show just precentages
    let depthLevel = searchInTree(tree, parent_id, "depthLevel");
    if (!depthLevel) {
      const isSlideshow = items.some((item) => item._id === parent_id);
      depthLevel = isSlideshow ? "slideshows" : "NOT_FOUND";
    }

    return (
      <React.Fragment>
        <BreadCrumbs studentId={student_id} parentId={parent_id} />

        <Grid
          container
          spacing={0}
          direction="row"
          justify="center"
          alignItems="center"
          style={{
            marginTop: "10px",
            padding: "20px"
          }}
        >
          <section>
            <h2>Statistieken voor {this.props.studentName}</h2>
            <h4>{searchInTree(tree, parent_id, "value")}</h4>
          </section>
          {isLoading
            ? this.spinner()
            : !isLoading && hasFailed
            ? this.warner()
            : !isLoading && !hasFailed && items && !items.length
            ? this.emptyRow()
            : this.contentSwitch(items, tree, depthLevel)}
        </Grid>
      </React.Fragment>
    );
  }
}

Statistics.propTypes = {
  fetch_slideshows_of: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  const { isLoading, hasFailed, errormessage, items } = state.slideshows.data;
  const { tree } = state.tree;
  return {
    isLoading,
    hasFailed,
    errormessage,
    items,
    tree
  };
};

export default connect(
  mapStateToProps,
  { fetch_slideshows_of }
)(Statistics);
