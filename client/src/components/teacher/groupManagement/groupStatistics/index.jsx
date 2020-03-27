import React, { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
// Components
import Home from "./home";
import GroupContainer from "../../../shared/group/Container";
import Sidebar from "../../../shared/sidebar";
// Services
import { httpService } from "services/http";
import { apiUrl, routeUrls } from "services/config";
// Services
// Tool
import TreeView from "../../../shared/tree-view/TreeView";
import MuTreeview from "../../../shared/tree-view/MuTreeview";
// Material UI
import { Grid } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";

const useStyle = makeStyles((theme) => ({
  sidebarBorder: {
    [theme.breakpoints.up("sm")]: {
      //   borderRight: "1px solid rgba(0, 0, 0, 0.12)",
      //   boxShadow:
      //     "rgba(0, 0, 0, 0.16) 0px 3px 10px, rgba(0, 0, 0, 0.23) 0px 3px 10px",
      //   borderRadius: "0px"
      borderRight: "1px solid rgba(0, 0, 0, 0.12)"
    }
  }
}));

export default function(props) {
  const classes = useStyle();
  const { group_id } = props.match.params;
  const [group, setGroup] = useState({});
  const [headerSubtitle, setSubtitle] = useState("");

  // Fetch group
  async function getGroup(groupId) {
    const results = await httpService.get(`${apiUrl}/group/${groupId}`);
    if (results) {
      setGroup(results.data[0]);
    }
  }

  const getSubtitleFromChild = (subtitle) => {
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
      <Grid container spacing={0} direction="row" justify="center">
        <Grid item xs={12} sm={3} className={classes.sidebarBorder}>
          <Sidebar>
            <TreeView
              itemType="tree"
              treeName="Alfa"
              userId={group_id}
              pathName={props.location.pathname}
            />

            {/* <MuTreeview
              itemType="tree"
              treeName="Alfa"
              userId={group_id}
              pathName={props.location.pathname}
            /> */}
          </Sidebar>
        </Grid>
        <Grid item xs={12} sm={9}>
          <Switch>
            {/* Statistics for one group */}
            <Route
              path={`${routeUrls.teacher.group.statistics}/group/:group_id/branch/:branch_id`}
              exact
              render={(props) => (
                <Home
                  groupInfo={group}
                  getSubtitleFromChild={getSubtitleFromChild}
                  {...props}
                />
              )}
            />
            <Route
              exact
              render={() => <h2> TODO : Group statistics landing page! </h2>}
            />
          </Switch>
        </Grid>
      </Grid>
    </GroupContainer>
  );
}
