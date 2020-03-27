import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { add_new_thema } from "../../store/actions/tree";
// Services
import { routeUrls } from "../../services/config";
import { historyService } from "../../services/history";
// Material UI
import { withStyles } from "@material-ui/core/styles";
import {
  TextField,
  Grid,
  Fab,
  Divider,
  LinearProgress,
  IconButton
} from "@material-ui/core/";
import CloseIcon from "@material-ui/icons/Close";
import { SnackbarProvider, withSnackbar } from "notistack";

//import { searchInTree } from "../../services/searchInTree";

const initialState = {
  value: "",
  icon: "",
  color: "#000",
  errors: {},
  loading: false
};

const styles = (theme) => ({
  registerForm: {
    maxWidth: "500px",
    textAlign: "center"
  },
  registerGrid: {
    paddingLeft: "20px",
    paddingRight: "20px"
  },
  textField: {
    marginTop: "35px"
  },
  divider: {
    margin: "20px 0px"
  },
  closeIcon: {
    color: "#fff",
    padding: theme.spacing(0.5)
  }
});

class AddNewThema extends Component {
  state = {
    value: "",
    icon: "",
    color: "#000",
    errors: {},
    loading: false
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      errors: {
        ...this.state.errors,
        [e.target.name]: ""
      }
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    const newItem = {
      value: this.state.value,
      icon: this.state.icon,
      color: this.state.color
    };
    try {
      // const result = await httpService.post(
      //   `${apiUrl}/author/new-thema`,
      //   newItem
      // );
      this.props.add_new_thema(
        newItem,
        historyService,
        this.handleClickVariant
      );
      this.setState(initialState);
    } catch (err) {
      this.setState({
        errors: err.response.data,
        loading: false
      });
    }
  };

  componentWillReceiveProps(nextProps) {
    const { errors } = nextProps;
    if (errors) {
      this.setState({
        errors: nextProps.errors,
        loading: false
      });
    }
  }

  handleCancel = () => {
    historyService.push(`${routeUrls.author.default}`);
  };

  /////// Snackbar functions /////////
  handleClickVariant = (variant) => {
    // variant could be success, error, warning or info
    this.props.enqueueSnackbar("Nieuwe thema is succesvol gemaakt !", {
      variant,
      action: this.snackAction,
      autoHideDuration: 2500
    });
  };

  // add multiple actions to one snackbar
  snackAction = (key) => (
    <React.Fragment>
      <IconButton
        key="close"
        aria-label="Close"
        className={this.props.classes.closeIcon}
        onClick={() => {
          this.props.closeSnackbar(key);
        }}
      >
        <CloseIcon />
      </IconButton>
    </React.Fragment>
  );

  ///////////////////////////////////////
  render() {
    const { value, icon, color, errors, loading } = this.state;
    const { classes } = this.props;
    return (
      <Grid
        container
        spacing={4}
        justify="center"
        alignItems="center"
        className={classes.registerGrid}
      >
        <Grid item sm={2} />
        <Grid item container justify="center" alignItems="center" sm={8}>
          <form
            onSubmit={this.handleSubmit}
            className={classes.registerForm}
            noValidate
          >
            <TextField
              variant="outlined"
              error={errors.value ? true : false}
              helperText={errors.value}
              value={value}
              name="value"
              required
              label="Thema's naam"
              onChange={this.handleChange}
              margin="dense"
              className={classes.textField}
              fullWidth
            />
            <TextField
              variant="outlined"
              error={errors.icon ? true : false}
              helperText={errors.icon}
              value={icon}
              name="icon"
              required
              label="Icon"
              onChange={this.handleChange}
              margin="dense"
              className={classes.textField}
              fullWidth
            />
            <TextField
              type="color"
              variant="outlined"
              error={errors.color ? true : false}
              helperText={errors.color}
              value={color}
              name="color"
              required
              label="Kies kleur"
              onChange={this.handleChange}
              margin="dense"
              className={classes.textField}
              style={{ width: "100px", height: "30px" }}
              //   fullWidth
            />

            {!loading ? (
              <Divider className={classes.divider} />
            ) : (
              <LinearProgress className={classes.divider} />
            )}
            <Grid container direction="row">
              <Grid container justify="center" alignItems="center" item xs={6}>
                <Fab
                  type="submit"
                  variant="extended"
                  color="primary"
                  size="large"
                  onClick={this.handleSubmit}
                  disabled={loading}
                >
                  Opslaan
                </Fab>
              </Grid>
              <Grid container justify="center" alignItems="center" item xs={6}>
                <Fab
                  variant="extended"
                  color="secondary"
                  size="large"
                  onClick={this.handleCancel}
                >
                  Annuleren
                </Fab>
              </Grid>
            </Grid>
          </form>
        </Grid>
        <Grid item sm={2} />
      </Grid>
    );
  }
}

AddNewThema.propTypes = {
  add_new_thema: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  tree: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  hasFailed: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => {
  const {
    isLoading,
    hasFailed,
    currentParent,
    tree,
    message,
    errors
  } = state.tree;
  return {
    isLoading,
    hasFailed,
    currentParent,
    tree,
    message,
    errors
  };
};

const registerThema = connect(
  mapStateToProps,
  { add_new_thema }
)(withStyles(styles)(AddNewThema));

const RegPage = withSnackbar(registerThema);

function RegisterWithSnack() {
  return (
    <SnackbarProvider maxSnack={3}>
      <RegPage />
    </SnackbarProvider>
  );
}

export default RegisterWithSnack;
