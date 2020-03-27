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
//import SwitchCheck from "../../shared/switch";
import ConfirmDialog from "../../shared/dialog";
import SearchBox from "../../shared/inputs/expand-searchbox/";
// Services
//import { backendService } from "services/backend";
import { userService } from "services/user";
import { routeUrls, tagLevels } from "services/config";
import { searchByGroupName } from "services/results-filters";
// Material ui
import {
  Tooltip,
  //Slide,
  Grow,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Divider,
  Fab,
  Icon,
  CardActions
} from "@material-ui/core/";
import { withStyles } from "@material-ui/styles";

const Transition = React.forwardRef((props, ref) => (
  <Grow ref={ref} {...props} />
));

// const EnableDisableGroup = React.forwardRef((props, ref) => (
//   <SwitchCheck {...props} forwardRef={ref} />
// ));

const styles = () => ({
  iconsButton: {
    "&:hover": {
      outline: "0 !important",
      border: "0 !important",
      background: "0 !important"
    },
    "&:active": {
      outline: "0 !important",
      border: "0 !important"
    },
    "&:focus": {
      outline: "0 !important",
      border: "0 !important"
    }
  },
  addButton: {
    color: "#fff",
    //backgroundColor: "#26a69a",
    "&:hover": {
      //backgroundColor: "#00695c"
    }
  }
});

class Groups extends Component {
  state = {
    alfaRoot: "5ce26f814d65de88b425f250",
    open: false,
    currGroupId: "",
    filter: ""
  };

  async componentDidMount() {
    const user = userService.getCurrentUser();
    this.props.fetch_groups(user._id);
  }

  // Filter search
  filterChange = val => {
    this.setState({ filter: val });
  };

  clearSearch = () => {
    this.setState({ filter: "" });
  };

  changeActivity = () => {
    this.props.enable_disable_group(this.state.currGroupId);
    this.setState({
      open: false,
      currGroupId: ""
    });
  };

  handleDelete = () => {
    this.props.delete_group(this.state.currGroupId);
    this.setState({
      open: false,
      currGroupId: ""
    });
  };

  // Dialog handle open
  handleOpenDialog = groupId => {
    this.setState({
      open: true,
      currGroupId: groupId
    });
  };

  // Dialog handle close
  handleCloseDialog = () => {
    this.setState({
      open: false,
      currGroupId: ""
    });
  };

  groupsRender = data => {
    return data.map(
      (group, i) =>
        group.isActive && (
          <React.Fragment key={group._id}>
            <ListItem
              button
              component={Link}
              to={`${routeUrls.teacher.group.detail}/${group._id}`}
            >
              <ListItemText primary={group.name} />
              <ListItemSecondaryAction>
                {/* Group statistics */}
                <Link
                  to={`${routeUrls.teacher.group.statistics}/group/${group._id}/branch/${this.state.alfaRoot}/depthLevel/${tagLevels.THEME}`}
                  style={{ textDecoration: "none" }}
                >
                  <IconButton
                    aria-label="statistics"
                    className={this.props.classes.iconsButton}
                    disableFocusRipple
                  >
                    <Tooltip title="Statistieken bekijken">
                      <Icon>bar_chart</Icon>
                    </Tooltip>
                  </IconButton>
                </Link>
                {/* Modify group */}
                <Link
                  to={`${routeUrls.teacher.group.edit}/${group._id}`}
                  style={{ textDecoration: "none" }}
                >
                  <IconButton
                    aria-label="modify"
                    className={this.props.classes.iconsButton}
                    disableFocusRipple
                  >
                    <Tooltip title="Groep wijzigen">
                      <Icon>edit</Icon>
                    </Tooltip>
                  </IconButton>
                </Link>
                {/* Edit students  */}
                <Link
                  to={`${routeUrls.teacher.group.detail}/${group._id}/student`}
                  //to="#"
                  style={{ textDecoration: "none" }}
                >
                  <IconButton
                    aria-label="modify"
                    className={this.props.classes.iconsButton}
                    disableFocusRipple
                  >
                    <Tooltip title="Studenten wijzigen">
                      <Icon>group</Icon>
                    </Tooltip>
                  </IconButton>
                </Link>
                {/* Activate group supervised_user_circle */}
                <IconButton
                  aria-label="Enable-Disable"
                  className={this.props.classes.iconsButton}
                  disableFocusRipple
                  onClick={() => this.handleOpenDialog(group._id)}
                >
                  <Tooltip title="Groep deactiveren">
                    <Icon>visibility</Icon>
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
    const { classes, hasFailed, isLoading, items, message } = this.props;
    const filteredData = searchByGroupName(
      items || [],
      this.state.filter,
      true
    );
    return (
      <React.Fragment>
        {!hasFailed && isLoading ? (
          <Spinner />
        ) : !isLoading && hasFailed ? (
          <Warner message={message} />
        ) : filteredData.length === 0 ? (
          <React.Fragment>
            {this.searchFilter()}
            <ListItem>
              <Typography>Er zijn geen actieve groepen!</Typography>
            </ListItem>
          </React.Fragment>
        ) : filteredData && filteredData.length > 0 ? (
          <React.Fragment>
            {/* {this.confirmDialog()} */}
            <ConfirmDialog
              transition={Transition}
              dialogOpen={this.state.open}
              dialogTitle="Weet u zeker dat u deze groep wilt deactiveren ?`"
              dialogContent="U gaat de group deactiveren weet u zeker ?"
              implementConfirmState={this.changeActivity}
              handleCloseDialog={this.handleCloseDialog}
            />
            {this.searchFilter()}
            <List>{this.groupsRender(filteredData)}</List>
          </React.Fragment>
        ) : null}
        <CardActions
          style={{
            float: "right",
            padding: "1em",
            marginBottom: "0.5em"
          }}
        >
          <Link
            to={`${routeUrls.teacher.group.add}`}
            style={{ textDecoration: "none" }}
          >
            <Tooltip title="Voeg een nieuwe groep toe">
              <Fab className={classes.addButton} size="large" color="secondary">
                <Icon>add</Icon>
              </Fab>
            </Tooltip>
          </Link>
        </CardActions>
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
  mapStateToProps, //state => ({ groups: state.groups }),
  mapDispatchToProps
)(withStyles(styles)(Groups));
