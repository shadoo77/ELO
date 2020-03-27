import React, { useState, useEffect, useRef, memo } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
// Store
import { connect } from "react-redux";
import { fetch_tree, navigate_tree } from "../../../store/actions/tree";
// Services
import { httpService } from "../../../services/http";
import { apiUrl, routeUrls } from "../../../services/config";
import { historyService } from "../../../services/history";
import { userService } from "../../../services/user";
import { userRoles } from "../../../services/config";
import isEmpty from "../../../services/is-empty";
// Components
import Warner from "../../shared/warner";
import { searchInTree } from "../../../services/searchInTree";
// Material ui
import { makeStyles } from "@material-ui/core/styles";
import { TreeView, TreeItem } from "@material-ui/lab/";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { ListItem, CircularProgress } from "@material-ui/core/";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    maxWidth: 400
  },
  activeItem: {
    backgroundColor: "#ccc"
  }
});

function MuTreeview(props) {
  const rootId = "5ce26f814d65de88b425f24f"; // ALFA
  const classes = useStyles();
  const { treeName, treeProps, userId, pathName } = props;
  const [expandedItems, setExpandedItems] = useState([]);
  const [state, setState] = useState({
    loading: false,
    slideshows: []
  });
  // Get all slideshows
  async function getSlideshowsItems() {
    setState({
      ...state,
      loading: true
    });
    try {
      const results = await httpService.get(
        `${apiUrl}/content/slideshows/treeitems`
      );
      setState({
        ...state,
        loading: false,
        slideshows: results.data
      });
    } catch (err) {
      console.log(err);
    }
  }

  const getEntryPoint = id => {
    for (const slideshow of state.slideshows) {
      if (slideshow._id === id) return slideshow.entrypoint._id;
    }
    return null;
  };

  // Set default expanded items depends on path link
  function setDefaultExpandedItems(id) {
    const { tree } = treeProps;
    const itemPath =
      searchInTree(tree || {}, id, "path") ||
      searchInTree(tree || {}, getEntryPoint(id), "path");
    const itemPathArray = itemPath && itemPath.split("#");
    if (itemPathArray && itemPathArray.length) {
      setExpandedItems([...itemPathArray]);
    }
  }
  // Component did mount
  useEffect(() => {
    props.fetch_tree(rootId);
    getSlideshowsItems();
  }, []);

  // Function which skip the first invocation
  function useEffectSkipFirst(fn, arr) {
    const isFirst = useRef(true);
    useEffect(() => {
      if (isFirst.current) {
        isFirst.current = false;
        return;
      }
      fn();
    }, arr);
  }

  useEffectSkipFirst(() => {
    if (treeProps.tree && !isEmpty(treeProps.tree)) {
      const tempArr = props.pathName.split("/");
      const activeTreeItem =
        tempArr.includes("parent") || tempArr.includes("branch");
      if (activeTreeItem) {
        const id = tempArr[tempArr.length - 1];
        setDefaultExpandedItems(id);
      } else {
        setExpandedItems([rootId]);
      }
    }
  }, [treeProps.tree]);

  const getActiveItem = () => {
    return expandedItems.length && expandedItems[expandedItems.length - 1];
  };

  // Handle click
  function onNodeToggle(nodeId, expanded) {
    setDefaultExpandedItems(nodeId);
    const studentStatistics = pathName.includes("student/status/");
    const groupStatistics = pathName.includes("group/statistics/");

    if (userService.getUserRole() === userRoles.TEACHER) {
      if (!userId || userId === null) {
        historyService.push("/404");
      } else {
        // TODO : check depthLevel value then go to the right page
        if (studentStatistics) {
          const parentId = nodeId !== rootId ? "/parent/" + nodeId : "";
          historyService.push(
            `${routeUrls.teacher.student.status}/${userId}${parentId}`
          );
        } else if (groupStatistics) {
          const branchId = nodeId !== rootId ? "/branch/" + nodeId : "";
          historyService.push(
            `${routeUrls.teacher.group.statistics}/${userId}${branchId}`
          );
        }
      }
    }
  }

  // Render slideshows
  const renderSlideShows = itemId => {
    const { loading, slideshows } = state;
    if (loading) {
      return (
        <ListItem>
          <CircularProgress />
        </ListItem>
      );
    }
    if (slideshows.length) {
      const items = slideshows.filter(
        slideshow => slideshow.entrypoint._id === itemId
      );
      return items.map((item, index) => (
        <TreeItem
          nodeId={item._id}
          label={"Opdracht" + (index + 1)}
          key={item._id}
        />
      ));
    }
  };

  // Render tree items
  const alfaChildren = items => {
    const { isLoading, hasFailed, message } = treeProps;
    return isLoading ? (
      <ListItem>
        <CircularProgress />
      </ListItem>
    ) : !isLoading && hasFailed ? (
      <Warner message={message} />
    ) : !isLoading && !hasFailed && items && items.length === 0 ? (
      <ListItem>Empty tree</ListItem>
    ) : (
      items.map((item, i) => (
        <TreeItem
          nodeId={item._id}
          label={item.value}
          key={item._id}
          onClick={() => onNodeToggle(item._id)}
          classes={{
            content:
              getActiveItem() &&
              getActiveItem() === item._id &&
              classes.activeItem
          }}
        >
          {item.children && item.children.length
            ? alfaChildren(item.children || [])
            : renderSlideShows(item._id)}
        </TreeItem>
      ))
    );
  };

  return expandedItems.length ? (
    <TreeView
      className={classes.root}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      defaultExpanded={expandedItems}
      //onNodeToggle={onNodeToggle}
    >
      <TreeItem nodeId={rootId} label={treeName}>
        {alfaChildren(treeProps.tree.children || [])}
      </TreeItem>
    </TreeView>
  ) : null;
}

MuTreeview.propTypes = {
  fetch_tree: PropTypes.func.isRequired,
  navigate_tree: PropTypes.func.isRequired,
  treeProps: PropTypes.object.isRequired,
  slideshowsState: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  treeProps: state.tree,
  slideshowsState: state.slideshows.data
});

const mapDispatchToProps = dispatch => {
  return {
    fetch_tree: (parentId, targetId) =>
      dispatch(fetch_tree(parentId, targetId)),
    navigate_tree: id => dispatch(navigate_tree(id))
  };
};

//const MuTreeviewWithRouter = withRouter(MuTreeview);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MuTreeview);
