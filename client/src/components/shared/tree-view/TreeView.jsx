import React, { Component } from "react";
import PropTypes from "prop-types";
// Store
import { connect } from "react-redux";
import { fetch_tree, navigate_tree } from "../../../store/actions/tree";
// Services
import { httpService } from "../../../services/http";
import { apiUrl, routeUrls } from "../../../services/config";
import { historyService } from "../../../services/history";
import { withStyles } from "@material-ui/core/styles";
import { userService } from "../../../services/user";
import { userRoles } from "../../../services/config";
// Components
import Warner from "../../shared/warner";
import { searchInTree } from "../../../services/searchInTree";
// Import sidebar styles from Them file
import { treeViewStyle } from "../Theme";

import {
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Icon,
  CircularProgress
} from "@material-ui/core/";
import { ExpandLess, ExpandMore } from "@material-ui/icons/";

class TreeView extends Component {
  constructor(props) {
    super(props);
    const local = localStorage.getItem("state");
    if (local) {
      this.state = JSON.parse(local);
    } else {
      this.state = {
        open: { rootItem: true },
        slideshowsItems: {
          isLoading: false,
          items: []
        }
      };
    }
  }

  componentDidMount() {
    const rootId = "5ce26f814d65de88b425f24f"; // ALFA
    this.props.fetch_tree(rootId);
    this.setState({ slideshowsItems: { isLoading: true } });
  }

  async componentWillReceiveProps(nextProps) {
    const { isLoading, hasFailed, tree } = nextProps.treeProps;
    try {
      if (nextProps.treeProps && !isLoading && !hasFailed) {
        const open = this.getCollapsOpenState(tree.children);
        const items = await this.getSlideshowsItems();
        // Check if we have state in our local storage
        const local = localStorage.getItem("state");
        if (local) {
          this.setState(JSON.parse(local));
        } else {
          this.setState({
            open: { ...this.state.open, ...open },
            slideshowsItems: {
              isLoading: false,
              items
            }
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  getEntryPoint = id => {
    const slideshows = this.state.slideshowsItems.items;
    for (const slideshow of slideshows) {
      if (slideshow._id === id) return slideshow.entrypoint._id;
    }
    return null;
  };

  handleClick = id => {
    if (id === "rootItem") {
      this.setState(
        {
          open: {
            ...this.state.open,
            [id]: !this.state.open[id]
          }
        },
        () => {
          localStorage.setItem("state", JSON.stringify(this.state));
        }
      );
    } else {
      const { tree } = this.props.treeProps;
      const itemPath =
        searchInTree(tree || {}, id, "path") ||
        searchInTree(tree || {}, this.getEntryPoint(id), "path");
      const itemPathArray = itemPath.split("#");
      const tempObj = { ...this.state.open };

      Object.keys(tempObj).forEach(key => (tempObj[key] = false));
      tempObj["rootItem"] = true;
      itemPathArray.forEach(el => {
        tempObj[el] = true;
      });

      this.setState(
        {
          // open: {
          //   ...this.state.open,
          //   [id]: !this.state.open[id]
          // }
          open: tempObj
        },
        () => {
          localStorage.setItem("state", JSON.stringify(this.state));
        }
      );
    }

    const studentStatistics = this.props.pathName.includes("student/status/");
    const groupStatistics = this.props.pathName.includes("group/statistics/");

    if (userService.getUserRole() === userRoles.TEACHER) {
      if (!this.props.userId || this.props.userId === null) {
        historyService.push("/404");
      } else {
        // TODO : check depthLevel value then go to the right page
        if (studentStatistics) {
          const parentId = id !== "rootItem" ? "/parent/" + id : "";
          historyService.push(
            `${routeUrls.teacher.student.status}/${this.props.userId}${parentId}`
          );
        } else if (groupStatistics) {
          const branchId = id !== "rootItem" ? "/branch/" + id : "";
          historyService.push(
            `${routeUrls.teacher.group.statistics}/${this.props.userId}${branchId}`
          );
        }
      }
    }
  };

  ///// Get treeview data for the last child (for slideshows)
  async getSlideshowsItems() {
    try {
      const results = await httpService.get(
        `${apiUrl}/content/slideshows/treeitems`
      );
      return results.data;
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  /* ///////// Change the content based on the sidebar item (OnClick) */
  // changeTheContent = slideshowID => {
  //   if (userService.getUserRole() === userRoles.TEACHER) {
  //     if (!this.props.userId || this.props.userId === null) {
  //       historyService.push("/404");
  //     } else {
  //       historyService.push(
  //         `${routeUrls.teacher.student.status}/${
  //           this.props.userId
  //         }/slideshow/${slideshowID}`
  //       );
  //     }
  //   }
  // };
  //////////////////////////////////////////////////////////////////////

  /* /////////// Get id's and set it's in state to make controle
  ////////////// when we click on arrow to open the collaps //// */
  getCollapsOpenState(data) {
    let result = {};
    if (data.length) {
      data.forEach(item => {
        result[item._id] = false;
        if (item.hasOwnProperty("children")) {
          if (item.children.length) {
            const child = this.getCollapsOpenState(item.children);
            result = { ...result, ...child };
          }
          //else {
          /*///// It's unneccesery so TODO later i'll remove it when i'm sure that
           i'll not use it because this case is just only for last child which doesn't
           /////////// have any child like slideshow */
          // const slideshows = this.props.slideshowsState.items.filter(
          //   slideshow => slideshow.entrypoint._id === item._id
          // );
          // if (slideshows.length) {
          //   slideshows.forEach(element => {
          //     result[element._id] = false;
          //   });
          // }
          //}
        }
      });
    }
    return result;
  }
  //////////////////////////////////////////////////

  /* /////////// Get tree data */
  // getTreeView(data) {
  //   let result = [];
  //   if (data.length) {
  //     data.forEach(item => {
  //       const obj = {};
  //       obj[item._id] = false;
  //       if (item.hasOwnProperty("children")) {
  //         if (item.children.length) {
  //           obj.children = this.getTreeView(item.children);
  //         } else {
  //           const slideshows = this.props.slideshowsState.items.filter(
  //             slideshow => slideshow.entrypoint._id === item._id
  //           );
  //           let lastChild = [];
  //           slideshows.forEach(element => {
  //             const subObj = {};
  //             subObj[element._id] = false;
  //             lastChild.push(subObj);
  //           });
  //           obj.children = lastChild;
  //         }
  //       }
  //       result.push(obj);
  //     });
  //   }
  //   return result;
  // }
  /////////////////////////////////////////////////

  //////////////////////////////////////////////////////////////////
  lastChildOfList = ID => {
    // const {
    //   items,
    //   isLoading,
    //   hasFailed,
    //   errormessage
    // } = this.props.slideshowsState;
    // if (isLoading || !items) {
    //   return (
    //     <ListItem>
    //       <CircularProgress />
    //     </ListItem>
    //   );
    // } else if (!isLoading && hasFailed) {
    //   return <Warner message={errormessage} />;
    // }
    const { items, isLoading } = this.state.slideshowsItems;
    const activeTreeItem =
      this.props.pathName.split("/parent/")[1] ||
      this.props.pathName.split("/branch/")[1];
    if (isLoading) {
      return (
        <ListItem>
          <CircularProgress />
        </ListItem>
      );
    }
    if (items.length) {
      const slideshows = items.filter(
        slideshow => slideshow.entrypoint._id === ID
      );
      return slideshows.map((item, index) => (
        <ListItem
          button
          key={index + "last-child"}
          className={this.props.classes.thirdLayer}
          onClick={() => this.handleClick(item._id)}
          style={{
            backgroundColor: item._id === activeTreeItem && "#cecece"
          }}
        >
          <ListItemIcon>
            <Icon>local_offer</Icon>
          </ListItemIcon>
          <ListItemText primary={"Opdracht" + (index + 1)} />
        </ListItem>
      ));
    }
  };
  //////////////////////////////////////////////////////////////////

  listHasChildren = (treeItems, layer) => {
    const { firstLayer, secondLayer, thirdLayer } = this.props.classes;
    const { isLoading, hasFailed, message } = this.props.treeProps;
    const activeTreeItem =
      this.props.pathName.split("/parent/")[1] ||
      this.props.pathName.split("/branch/")[1];
    return isLoading ? (
      <ListItem>
        <CircularProgress />
      </ListItem>
    ) : !isLoading && hasFailed ? (
      <Warner message={message} />
    ) : !isLoading && !hasFailed && treeItems && treeItems.length === 0 ? (
      <ListItem>Empty tree</ListItem>
    ) : (
      treeItems.map((item, index) => (
        <React.Fragment key={index + "has-child"}>
          <ListItem
            button
            onClick={() => this.handleClick(item._id)}
            className={
              layer === 0 ? firstLayer : layer === 1 ? secondLayer : thirdLayer
            }
            style={{
              backgroundColor: item._id === activeTreeItem && "#cecece"
            }}
          >
            <ListItemIcon>
              {this.state.open[item._id] ? <ExpandLess /> : <ExpandMore />}
            </ListItemIcon>
            <ListItemText primary={item.value} />
          </ListItem>
          <Collapse in={this.state.open[item._id]} timeout="auto" unmountOnExit>
            <List component="nav" disablePadding>
              {item.children && item.children.length
                ? this.listHasChildren(item.children, layer + 1)
                : this.lastChildOfList(item._id)}
            </List>
          </Collapse>
        </React.Fragment>
      ))
    );
  };

  render() {
    const { classes, treeName, treeProps } = this.props;
    const activeTreeItem = this.props.pathName.includes(
      "/parent/" || "/branch/"
    );
    //console.log("Local storage of treeview :::: ", this.state);
    return (
      <List component="nav" className={classes.listRoot}>
        {/* alfa is the first parent   */}

        <ListItem
          button
          onClick={() => this.handleClick("rootItem")}
          style={{
            backgroundColor: !activeTreeItem && "#cecece"
          }}
        >
          <ListItemIcon>
            {this.state.open.rootItem ? <ExpandLess /> : <ExpandMore />}
          </ListItemIcon>
          <ListItemText primary={treeName} />
        </ListItem>

        <Collapse in={this.state.open.rootItem} timeout="auto" unmountOnExit>
          <List component="nav" disablePadding>
            {this.listHasChildren(treeProps.tree.children || [], 0)}
          </List>
        </Collapse>
      </List>
    );
  }
}

TreeView.propTypes = {
  fetch_tree: PropTypes.func.isRequired,
  //fetch_all_slideshows: PropTypes.func.isRequired,
  navigate_tree: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
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
    //fetch_all_slideshows: () => dispatch(fetch_all_slideshows())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(treeViewStyle)(TreeView));

// export default withStyles(treeViewStyle)(TreeView);
