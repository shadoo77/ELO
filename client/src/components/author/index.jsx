import React, { Component } from "react";
// import { httpService } from "../../services/http";
// import { apiUrl } from "../../services/config";
import { Switch, Route } from "react-router-dom";
// Import history file
//import { historyService } from "../../services/history";
// Import user info
import { userService } from "../../services/user";
// Import sidebar
import NavBar from "components/shared/navbar/";
import Sidebar from "../shared/sidebar";
// Import TreeView
import TreeView from "../shared/tree-view/TreeView";
// Import author home page
import HomePage from "./Home";
// Material UI
import { Grid } from "@material-ui/core/";

// Import components :
import AddNewThema from "./AddNewThema";
import AddCSV from "./AddCSV";

class AuthorContainer extends Component {
  state = {
    // studentID: "",
    // studentName: ""
  };

  render() {
    const { _id, name } = userService.getCurrentUser();

    return (
      <Grid
        container
        spacing={0}
        direction="row"
        justify="center"
        //alignItems="center"  this is for vertical align
      >
        <Grid item container>
          <NavBar />
        </Grid>
        <Grid item container>
          <Grid item xs={12} sm={3}>
            <Sidebar>
              <TreeView itemType="tree" treeName="Alfa" userId={_id} pathName={this.props.location.pathname} />
              <div itemtext="ffff" itemType="link" linkTo="/author/add-csv" />
            </Sidebar>
          </Grid>
          <Grid item xs={12} sm={9}>
            <Switch>
              <Route path="/author/new-thema" exact component={AddNewThema} />
              <Route path="/author/add-csv" exact component={AddCSV} />
              <Route path="/author/home" exact render={(props) => <HomePage authorName={name} {...props} />} />
            </Switch>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default AuthorContainer;
