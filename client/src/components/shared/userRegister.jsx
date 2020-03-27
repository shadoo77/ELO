import React, { Component } from "react";
import PropTypes from "prop-types";
import { httpService } from "../../services/http";
import {
  apiUrl,
  userRoles,
  routeUrls
} from "../../services/config";
import { historyService } from "../../services/history";
import { withStyles } from "@material-ui/core/styles";
import {
  FormControlLabel,
  FormControl,
  RadioGroup,
  FormLabel,
  Radio,
  TextField,
  Grid,
  Fab,
  Divider,
  LinearProgress,
  IconButton
} from "@material-ui/core/";
import CloseIcon from "@material-ui/icons/Close";
import { SnackbarProvider, withSnackbar } from "notistack";

const initialState = {
  name: "",
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
  role: `${userRoles.TEACHER}`,
  errors: {},
  loading: false
};

const styles = theme => ({
  registerForm: {
    maxWidth: "500px"
  },
  registerGrid: {
    paddingLeft: "20px",
    paddingRight: "20px"
  },
  textField: {
    marginTop: "35px"
  },
  radioGroup: {
    paddingLeft: "3em"
  },
  divider: {
    margin: "20px 0px"
  },
  radioItem: {
    padding: "0px 20px"
  },
  closeIcon: {
    color: "#fff",
    padding: theme.spacing(0.5)
  }
});

class UserRegister extends Component {
  state = {
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: `${userRoles.TEACHER}`,
    errors: {},
    loading: false
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleRadioChange = e => {
    this.setState({ role: e.target.value });
  };

  handleSubmit = async e => {
    e.preventDefault();
    this.setState({ loading: true });
    const newItem = {
      name: this.state.name,
      email: this.state.email,
      username: this.state.username,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword,
      role: this.state.role
    };
    try {
      await httpService.post(
        `${apiUrl}/auth/user-register`,
        newItem
      );
      this.setState(initialState);
      this.handleClickVariant("success");
      setTimeout(() => {
        historyService.push(
          `${routeUrls.admin.auth.login}`
        );
      }, 3000);
    } catch (err) {
      this.setState({
        errors: err.response.data,
        loading: false
      });
    }
  };

  handleCancel = () => {
    historyService.push(`${routeUrls.admin.auth.login}`);
  };

  /////// Snackbar functions /////////
  handleClickVariant = variant => {
    // variant could be success, error, warning or info
    this.props.enqueueSnackbar(
      "Nieuwe account is succesvol gemaakt !",
      {
        variant,
        action: this.snackAction,
        autoHideDuration: 2500
      }
    );
  };

  // add multiple actions to one snackbar
  snackAction = key => (
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
    const {
      name,
      username,
      email,
      password,
      confirmPassword,
      role,
      errors,
      loading
    } = this.state;
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
        <Grid
          item
          container
          justify="center"
          alignItems="center"
          sm={8}
        >
          <form
            onSubmit={this.handleSubmit}
            className={classes.registerForm}
            noValidate
          >
            <TextField
              variant="outlined"
              error={errors.name ? true : false}
              helperText={errors.name}
              value={name}
              name="name"
              required
              label="Naam"
              onChange={this.handleChange}
              margin="dense"
              className={classes.textField}
              fullWidth
            />
            <TextField
              variant="outlined"
              error={errors.username ? true : false}
              helperText={errors.username}
              value={username}
              name="username"
              required
              label="Gebruikersnaam"
              onChange={this.handleChange}
              margin="dense"
              className={classes.textField}
              fullWidth
            />
            <TextField
              variant="outlined"
              error={errors.email ? true : false}
              helperText={errors.email}
              value={email}
              name="email"
              required
              label="Email"
              onChange={this.handleChange}
              margin="dense"
              className={classes.textField}
              fullWidth
            />
            <TextField
              variant="outlined"
              error={errors.password ? true : false}
              helperText={errors.password}
              value={password}
              name="password"
              required
              type="password"
              label="Wachtwoord"
              onChange={this.handleChange}
              margin="dense"
              className={classes.textField}
              fullWidth
            />
            <TextField
              variant="outlined"
              error={errors.confirmPassword ? true : false}
              helperText={errors.confirmPassword}
              value={confirmPassword}
              name="confirmPassword"
              required
              type="password"
              label="Wachtwoord bevestigen"
              onChange={this.handleChange}
              margin="dense"
              className={classes.textField}
              fullWidth
            />
            <Divider className={classes.divider} />
            {/* Checkboxes for user role (teacher , author or admin) */}
            <FormControl
              component="fieldset"
              className={classes.formControl}
            >
              <FormLabel component="legend">
                Kies de rol :{" "}
              </FormLabel>
              <RadioGroup
                aria-label="Roles"
                name="radio-group"
                className={classes.radioGroup}
                value={`${role}`}
                onChange={this.handleRadioChange}
                checked={role}
              >
                <FormControlLabel
                  value={`${userRoles.TEACHER}`}
                  control={
                    <Radio className={classes.radioItem} />
                  }
                  label="Docent"
                />
                <FormControlLabel
                  value={`${userRoles.ADMIN}`}
                  control={
                    <Radio className={classes.radioItem} />
                  }
                  label="Admin"
                />
                <FormControlLabel
                  value={`${userRoles.AUTHOR}`}
                  control={
                    <Radio className={classes.radioItem} />
                  }
                  label="Autheur"
                />
              </RadioGroup>
            </FormControl>
            {!loading ? (
              <Divider className={classes.divider} />
            ) : (
              <LinearProgress className={classes.divider} />
            )}
            <Grid container direction="row">
              <Grid
                container
                justify="center"
                alignItems="center"
                item
                xs={6}
              >
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
              <Grid
                container
                justify="center"
                alignItems="center"
                item
                xs={6}
              >
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

UserRegister.propTypes = {
  classes: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired
};

const registerForm = withStyles(styles)(UserRegister);

const RegPage = withSnackbar(registerForm);

function RegisterWithSnack() {
  return (
    <SnackbarProvider maxSnack={3}>
      <RegPage />
    </SnackbarProvider>
  );
}

export default RegisterWithSnack;
