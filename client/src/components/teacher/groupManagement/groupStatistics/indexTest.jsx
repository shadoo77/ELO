import React, { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
// Components
import Home from "./home";
import GroupContainer from "../../../shared/group/Container";
//import Sidebar from "../../../shared/sidebar";
import Sidebar from "../../../shared/sidebar/test";
// Services
import { httpService } from "services/http";
import { apiUrl, routeUrls } from "services/config";
// Services
// Tool
//import TreeView from "../../../shared/tree-view/TreeView";
import MuTreeview from "../../../shared/tree-view/MuTreeview";
// Material UI
import { Icon, Box, Tooltip } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";

const useStyle = makeStyles(theme => ({
  sideBarArea: {
    position: "relative",
    height: "100%",
    borderRight: "1px solid #ccc",
    //width: ({ open }) => (open ? "20%" : "5%"),
    transition: theme.transitions.create("all", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    [theme.breakpoints.down("xs")]: {
      width: "100%"
    }
  },
  pullIcon: {
    zIndex: theme.zIndex.sideBarArea + 10,
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    msTransform: "translateY(-50%)",
    right: -25,
    borderRadius: "50%",
    backgroundColor: theme.palette.secondary.main,
    padding: 10,
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    [theme.breakpoints.down("xs")]: {
      display: "none"
    }
  },
  verticalMenuTitle: {
    position: "relative",
    minHeight: "100vh",
    height: "100%",
    width: "100%",
    fontSize: 20,
    color: "#fff",
    //backgroundColor: theme.palette.primary.main,
    transition: theme.transitions.create("all", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  verticalMenuTitleText: {
    position: "absolute",
    top: "62%",
    left: "25%",
    fontSize: 30,
    transform: "rotate(-90deg)",
    whiteSpace: "nowrap",
    transformOrigin: "0 0",
    transition: theme.transitions.create("all", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  }
}));

export default function(props) {
  const [open, setOpen] = useState(true);
  const classes = useStyle({ open });
  const { group_id } = props.match.params;
  const [group, setGroup] = useState({});
  const [headerSubtitle, setSubtitle] = useState("");

  const onToggle = () => {
    setOpen(!open);
  };

  // Fetch group
  async function getGroup(groupId) {
    const results = await httpService.get(
      `${apiUrl}/group/${groupId}`
    );
    if (results) {
      setGroup(results.data[0]);
    }
  }

  const getSubtitleFromChild = subtitle => {
    setSubtitle(subtitle);
  };

  // Component did mount
  useEffect(() => {
    getGroup(group_id);
  }, []);

  return (
    <GroupContainer
      title={`Statistieken voor ${group.name}`}
      subtitle={headerSubtitle}
    >
      {/* <Grid container spacing={0} direction="row" justify="center"> */}
      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="center"
      >
        <Box
          className={classes.sideBarArea}
          width={open ? "20%" : "1.5em"}
        >
          {open ? (
            <Sidebar>
              {/* <TreeView
              itemType="tree"
              treeName="Alfa"
              userId={group_id}
              pathName={props.location.pathname}
            /> */}

              <MuTreeview
                itemType="tree"
                treeName="Alfa"
                userId={group_id}
                pathName={props.location.pathname}
              />
            </Sidebar>
          ) : (
            <div className={classes.verticalMenuTitle}>
              {/* <div className={classes.test} /> */}
              <div
                className={classes.verticalMenuTitleText}
              />
              {/* Boom structuur
              </div> */}
            </div>
          )}
          <Tooltip
            title={!open ? "Menu open" : "Menu dicht doen"}
          >
            <Icon
              className={classes.pullIcon}
              onClick={onToggle}
            >
              {!open
                ? "keyboard_arrow_right"
                : "keyboard_arrow_left"}
            </Icon>
          </Tooltip>
        </Box>
        <Box flexGrow={1}>
          <Switch>
            {/* Statistics for one group */}
            <Route
              path={`${routeUrls.teacher.group.statistics}/:group_id/branch/:branch_id`}
              exact
              render={props => (
                <Home
                  groupInfo={group}
                  getSubtitleFromChild={
                    getSubtitleFromChild
                  }
                  {...props}
                />
              )}
            />
            <Route
              exact
              render={() => (
                <h2>
                  {" "}
                  TODO : Group statistics landing page!{" "}
                </h2>
              )}
            />
          </Switch>
        </Box>
      </Box>
    </GroupContainer>
  );
}
