import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
// Actions
import {
  fetch_groups,
  delete_group,
  enable_disable_group
} from "../../../store/actions/groups";
// Components
import Spinner from "../../shared/spinner";
import Warner from "../../shared/warner";
import ConfirmDialog from "../../shared/dialog";
import SearchBox from "../../shared/inputs/expand-searchbox/";

// Services
import { userService } from "services/user";
import { routeUrls } from "services/config";
import { searchByGroupName } from "services/results-filters";
// Material ui
import {
  Icon,
  Tooltip,
  //Slide,
  Grow,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Typography
} from "@material-ui/core/";

const Transition = React.forwardRef((props, ref) => (
  <Grow ref={ref} {...props} />
));

class InActiveGroups extends Component {
  state = {
    deleteDialogOpen: false,
    activateDialogOpen: false,
    currGroupId: "",
    filter: ""
  };

  componentDidMount() {
    const user = userService.getCurrentUser();
    this.props.fetch_groups(user._id);
  }

  handleDelete = () => {
    this.props.delete_group(this.state.currGroupId);
    this.setState({
      deleteDialogOpen: false,
      currGroupId: ""
    });
  };

  // Dialog handle open
  handleOpenDialog = groupId => {
    this.setState({
      deleteDialogOpen: true,
      currGroupId: groupId
    });
  };

  // Activate dialog
  handleOpenActivateDialog = groupId => {
    this.setState({
      activateDialogOpen: true,
      currGroupId: groupId
    });
  };

  changeActivity = () => {
    this.props.enable_disable_group(this.state.currGroupId);
    this.setState({
      activateDialogOpen: false,
      currGroupId: ""
    });
  };

  // Dialog handle close
  handleCloseDialog = () => {
    this.setState({
      deleteDialogOpen: false,
      activateDialogOpen: false,
      currGroupId: ""
    });
  };

  // Filter search
  filterChange = val => {
    this.setState({ filter: val });
  };

  clearSearch = () => {
    this.setState({ filter: "" });
  };

  // Render list items
  groupsRender = data => {
    return data.map(
      (group, i) =>
        !group.isActive && (
          <React.Fragment key={group._id}>
            <ListItem
              button
              component={Link}
              to={`${routeUrls.teacher.group.detail}/${group._id}`}
            >
              <ListItemText primary={group.name} />
              <ListItemSecondaryAction>
                {/* Activate group     &&&&&&&&&&&&&&&&&&&&&&   */}
                <IconButton
                  aria-label="Active"
                  onClick={() => this.handleOpenActivateDialog(group._id)}
                >
                  <Tooltip title="Groep activeren">
                    <Icon>visibility_off</Icon>
                  </Tooltip>
                </IconButton>
                {/* Delete group     &&&&&&&&&&&&&&&&&&&&&&   */}
                <IconButton
                  aria-label="Delete"
                  onClick={() => this.handleOpenDialog(group._id)}
                >
                  <Tooltip title="Groep verwijderen">
                    <Icon>delete_forever</Icon>
                  </Tooltip>
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>

            {i === data.length - 1 ? null : <Divider />}
          </React.Fragment>
        )
    );
  };

  searchFilter() {
    return (
      <React.Fragment>
        <SearchBox
          handleChange={this.filterChange}
          clearSearch={this.clearSearch}
          value={this.state.filter}
        />
        <Divider />
      </React.Fragment>
    );
  }

  render() {
    const { items, hasFailed, isLoading, message } = this.props;
    const inActiveItems =
      items && items.length ? items.filter(el => !el.isActive) : [];

    const filteredData = searchByGroupName(
      inActiveItems || [],
      this.state.filter,
      false
    );

    return (
      <React.Fragment>
        {!hasFailed && isLoading ? (
          <Spinner />
        ) : !isLoading && hasFailed ? (
          <Warner message={message} />
        ) : filteredData.length < 1 ? (
          <React.Fragment>
            {this.searchFilter()}
            <ListItem>
              <Typography>Er zijn geen inactieve groepen!</Typography>
            </ListItem>
          </React.Fragment>
        ) : filteredData && filteredData.length > 0 ? (
          <React.Fragment>
            <ConfirmDialog
              transition={Transition}
              dialogOpen={this.state.deleteDialogOpen}
              dialogTitle={`Weet u zeker dat u deze groep wilt verwijderen ?`}
              dialogContent={`U gaat de group verwijderen, weet u zeker ?`}
              implementConfirmState={this.handleDelete}
              handleCloseDialog={this.handleCloseDialog}
            />
            <ConfirmDialog
              transition={Transition}
              dialogOpen={this.state.activateDialogOpen}
              dialogTitle="Weet u zeker dat u deze groep wilt activeren ?"
              dialogContent="U gaat de group activeren, weet u zeker ?"
              implementConfirmState={this.changeActivity}
              handleCloseDialog={this.handleCloseDialog}
            />
            {this.searchFilter()}
            <List>{this.groupsRender(filteredData)}</List>
          </React.Fragment>
        ) : null}
        {/* </React.Fragment> */}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  const { hasFailed, isLoading, items, message } = state.groups;
  return {
    hasFailed,
    isLoading,
    items,
    message
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetch_groups: teacherId => dispatch(fetch_groups(teacherId)),
    delete_group: groupId => dispatch(delete_group(groupId)),
    enable_disable_group: groupId => dispatch(enable_disable_group(groupId))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InActiveGroups);
