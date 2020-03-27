import React, { useEffect } from "react";
import { connect } from "react-redux";
import { fetch_slideshows_of_group } from "../../../../store/actions/groups.slideshows";
import PropTypes from "prop-types";
// Components
import Warner from "../../../shared/warner";
//import LegendThema from "./LegendThema";
//import BreadCrumbs from "../../../shared/statistics/BreadCrumbs";
// Material Ui components
import { Grid, CircularProgress, Paper } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
// Import contents of statistics
import SlideshowsStatistics from "./SlideshowStatistics";
import ParagrafStatistics from "./ParagrafStatistics";
import ThemaStatistics from "./ThemaStatistics";
import DifficultyStatistics from "./DifficultyStatistics";
// Helpers
import { searchInTree } from "services/searchInTree";

const paperStyle = {
  width: "100%",
  margin: "3px auto",
  padding: "10px",
  textAlign: "center"
};

const useStyles = makeStyles(theme => ({
  mainContainer: {
    [theme.breakpoints.up("sm")]: {
      padding: theme.spacing(2)
    }
  },
  wrapperContainer: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper
  }
}));

const spinner = () => {
  return (
    <Paper style={paperStyle}>
      <CircularProgress />
    </Paper>
  );
};
// when the progress is empty
const emptyRow = () => {
  return <Paper style={paperStyle}>Geen vragen in database!</Paper>;
};

const warner = errormessage => {
  return (
    <Paper style={paperStyle}>
      <Warner message={errormessage} />
    </Paper>
  );
};

// Statistics component landing page
function GroupStatistics(props) {
  const classes = useStyles();
  const { group_id, branch_id } = props.match.params;
  const { users, isLoading, hasFailed, errormessage, tree } = props;
  const temp = users && users.length && users[0] && users[0].slideShows;
  let depthLevel = searchInTree(tree, branch_id, "depthLevel");
  if (!depthLevel) {
    const isSlideshow =
      temp && temp.length && temp.some(item => item._id === branch_id);
    depthLevel = isSlideshow ? "slideshows" : "NOT_FOUND";
  }

  // Component did mount
  useEffect(() => {
    props.fetch_slideshows_of_group(branch_id, group_id);
  }, []);

  // Component did update
  useEffect(() => {
    props.fetch_slideshows_of_group(branch_id, group_id);
  }, [group_id, branch_id]);

  // Content change
  const contentSwitch = (items, tree, depthLevel) => {
    props.getSubtitleFromChild(searchInTree(tree, branch_id, "value"));
    if (depthLevel === "slideshows") {
      return <SlideshowsStatistics data={items || []} />;
    } else if (depthLevel === "paragraf") {
      return <ParagrafStatistics data={items || []} />;
    } else if (depthLevel === "thema") {
      return (
        <ThemaStatistics themaId={branch_id} data={items || []} tree={tree} />
      );
    } else if (depthLevel === "difficulty") {
      return (
        <DifficultyStatistics
          diffId={branch_id}
          data={items || []}
          tree={tree}
        />
      );
    }
  };

  return (
    <React.Fragment>
      {/* <BreadCrumbs studentId={student_id} parentId={parent_id} /> */}
      <Grid
        container
        spacing={0}
        direction="row"
        justify="center"
        alignItems="center"
        className={classes.mainContainer}
      >
        {isLoading ? (
          spinner()
        ) : !isLoading && hasFailed ? (
          warner(errormessage)
        ) : !isLoading && !hasFailed && users && !users.length ? (
          emptyRow()
        ) : (
          <div className={classes.wrapperContainer}>
            {contentSwitch(users, tree, depthLevel)}
          </div>
        )}
      </Grid>
    </React.Fragment>
  );
}

GroupStatistics.propTypes = {
  fetch_slideshows_of_group: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  const { isLoading, hasFailed, errormessage, users } = state.groupsSlideshows;
  const { tree } = state.tree;
  return {
    isLoading,
    hasFailed,
    errormessage,
    users,
    tree
  };
};

export default connect(
  mapStateToProps,
  { fetch_slideshows_of_group }
)(GroupStatistics);
