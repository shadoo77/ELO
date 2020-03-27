import React from "react";
import PropTypes from "prop-types";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

// Collaps item
import CollapsItem from "../collaps";

// Import sidebar styles from Them file
//import { sidebarStyles } from "../Theme";

const useStyle = makeStyles(theme => ({
  toolbar: theme.mixins.toolbar,
  sidebarContainer: {
    display: "flex",
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      borderRight: "1px solid rgba(0, 0, 0, 0.12)"
    }
  },
  drawer: {
    width: "100%"
    //minHeight: "100%"
  },
  sidebarList: {
    overflowX: "hidden"
  },

  "@media (min-width: 600px)": {
    sidebarContainer: {
      minHeight: "100vh"
    },
    drawer: {
      width: "100%",
      minHeight: "100%",
      position: "relative",
      flexShrink: 0,
      overflowY: "visible",
      alignItems: "flex-start",
      backgroundColor: theme.palette.background.paper
    }
  }
}));

const SideBar = ({ children }) => {
  const classes = useStyle();
  const renderChildren = () => {
    if (Array.isArray(children)) {
      return children.map((child, index) => {
        if (child.props.itemType === "tree") {
          return (
            <div className={classes.sidebarList} key={"child-sidebar" + index}>
              {child}
            </div>
          );
        } else if (child.props.itemType === "link") {
          return (
            <Link key={"child-sidebar" + index} to={child.props.linkTo}>
              {child.props.itemtext}
            </Link>
          );
        } else {
          const { ...rest } = child.props;
          return (
            <CollapsItem
              {...rest}
              key={"child-sidebar" + index}
              itemtext={child.props.itemtext}
              itemicon={child.props.itemicon}
            >
              {child}
            </CollapsItem>
          );
        }
      });
    } else {
      if (children.props.itemType === "tree") {
        return <div className={classes.sidebarList}>{children}</div>;
      } else if (children.props.itemType === "link") {
        return (
          <Link to={children.props.linkTo}>{children.props.itemtext}</Link>
        );
      } else {
        const { ...rest } = children.props;
        return (
          <CollapsItem
            {...rest}
            key={"child-sidebar" + children}
            itemtext={children.props.itemtext}
            itemicon={children.props.itemicon}
          >
            {children}
          </CollapsItem>
        );
      }
    }
  };
  // current.offsetWidth
  //const testWidth = inputEl.current;
  // if (inputEl.current)
  //   console.log("hey :: ", inputEl.current.offsetWidth || "");
  return (
    <div className={classes.sidebarContainer}>
      <section className={classes.drawer}>{renderChildren()}</section>
    </div>
  );
};

SideBar.propTypes = {
  //classes: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired
};

export default SideBar;
