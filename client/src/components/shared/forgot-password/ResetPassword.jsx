import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
// Services
import {
  apiUrl,
  routeUrls
} from "../../../services/config";
import { httpService } from "../../../services/http";
import { withStyles } from "@material-ui/core/styles";
import { historyService } from "../../../services/history";
// Material UI
import {
  Typography,
  FormHelperText,
  TextField,
  Grid,
  Card,
  CardHeader,
  IconButton,
  Icon,
  CardContent,
  CardActions,
  List,
  ListItemIcon,
  ListItem,
  Fab,
  LinearProgress,
  Divider
} from "@material-ui/core/";

const styles = () => ({
  gridContainer: {
    marginTop: "10px",
    paddingLeft: "20px",
    paddingRight: "20px"
  },
  cardContainer: {
    width: "400px",
    textAlign: "center",
    padding: "20px 5px"
  },
  cardContent: {
    marginBottom: 0,
    paddingTop: 10,
    paddingBottom: 0
  },
  invalidOrExpaires: {
    borderRadius: "3px",
    border: "solid 1px #8e3030",
    backgroundColor: "#f2dada",
    color: "#8e3030",
    padding: "20px 10px",
    textAlign: "left"
  },
  sentSuccessful: {
    borderRadius: "3px",
    border: "solid 1px #004d40",
    backgroundColor: "#e0f2f1",
    color: "#004d40",
    padding: "20px 10px",
    textAlign: "left"
  },
  iconButton: {
    backgroundColor: "#2a90fc",
    color: "#fff",
    cursor: "default",
    "&:hover": {
      backgroundColor: "#2a90fc"
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
  inputField: {
    marginTop: "15px",
    marginBottom: "15px"
  },
  listContainer: {
    fontSize: "14px",
    paddingTop: 0
  },
  listItem: {
    paddingTop: "0px"
  },
  linearProgress: {
    margin: "15px"
  }
});

class ResetPassword extends Component {
  constructor() {
    super();
    this.state = {
      id: "",
      name: "",
      newPassword: "",
      confirmNewPassword: "",
      messageFromServer: "",
      errors: {},
      loading: false
    };
  }

  async componentDidMount() {
    try {
      const results = await httpService.get(
        `${apiUrl}/auth/reset-password`,
        {
          params: {
            resetPasswordToken: this.props.match.params
              .pass_token
          }
        }
      );

      this.setState({
        id: results.data.userID,
        name: results.data.name
      });
    } catch (err) {
      if (err.response && err.response.status === 403) {
        this.setState({ errors: err.response.data });
      }
    }
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async e => {
    e.preventDefault();
    const {
      id,
      newPassword,
      confirmNewPassword
    } = this.state;
    this.setState({ loading: true });
    const newPass = { id, newPassword, confirmNewPassword };
    try {
      const results = await httpService.post(
        `${apiUrl}/auth/reset-password`,
        newPass
      );
      this.setState({
        newPassword: "",
        confirmNewPassword: "",
        messageFromServer: results.data.success,
        loading: false,
        errors: {}
      });
      setTimeout(() => {
        historyService.push(`${routeUrls.admin.auth.login}`);
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

  render() {
    const {
      name,
      newPassword,
      confirmNewPassword,
      messageFromServer,
      errors,
      loading
    } = this.state;
    const { classes } = this.props;

    const resetPasswordForm = (
      <React.Fragment>
        <IconButton
          className={classes.iconButton}
          style={{ cursor: "default" }}
        >
          <Icon>lock_open</Icon>
        </IconButton>
        <CardHeader title="Verander uw wachtwoord" />
        {/* If the account is not activated here is the feedback */}
        {errors.notFound ? (
          <FormHelperText
            className={classes.invalidOrExpaires}
          >
            {errors.notFound}
          </FormHelperText>
        ) : messageFromServer ? (
          <FormHelperText
            className={classes.sentSuccessful}
          >
            {messageFromServer}
          </FormHelperText>
        ) : null}

        <CardContent className={classes.cardContent}>
          <Typography component="p" align="left">
            Hallo weer <strong>{name},</strong>
            <br />
            Wanneer u uw wachtwoord verandert, wordt u
            automatisch uitgelogd van al uw sessies. U kunt
            weer terug inloggen met uw nieuwe wachtwoord.
          </Typography>
          <form onSubmit={this.handleSubmit}>
            <TextField
              type="password"
              variant="outlined"
              error={errors.newPassword ? true : false}
              helperText={errors.newPassword}
              value={newPassword}
              name="newPassword"
              required
              label="Uw nieuwe wachtwoord"
              onChange={this.handleChange}
              margin="dense"
              className={classes.inputField}
              fullWidth
            />
            <TextField
              type="password"
              variant="outlined"
              error={
                errors.confirmNewPassword ? true : false
              }
              helperText={errors.confirmNewPassword}
              value={confirmNewPassword}
              name="confirmNewPassword"
              required
              label="Typ uw nieuwe wachtwoord opnieuw"
              onChange={this.handleChange}
              margin="dense"
              className={classes.inputField}
              fullWidth
            />

            {loading ? (
              <LinearProgress
                className={classes.linearProgress}
              />
            ) : (
              <Divider className={classes.linearProgress} />
            )}
            <CardActions>
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
            </CardActions>
          </form>
        </CardContent>
        <CardActions>
          <List
            color="primary"
            className={classes.listContainer}
          >
            <ListItem className={classes.listItem}>
              <ListItemIcon>
                <Icon color="primary">
                  keyboard_backspace
                </Icon>
              </ListItemIcon>
              <Link to={`${routeUrls.admin.auth.login}`}>
                Terug naar login pagina
              </Link>
            </ListItem>
          </List>
        </CardActions>
      </React.Fragment>
    );
    return (
      <Grid
        container
        spacing={4}
        direction="row"
        justify="center"
        alignItems="center"
        className={classes.gridContainer}
      >
        <Grid item xs={1} sm={2} />
        <Grid
          container
          item
          xs={10}
          sm={8}
          justify="center"
          alignItems="center"
        >
          <Card className={classes.cardContainer}>
            {errors.invalid ? (
              <FormHelperText
                className={classes.invalidOrExpaires}
              >
                {errors.invalid}
              </FormHelperText>
            ) : (
              resetPasswordForm
            )}
          </Card>
        </Grid>
        <Grid item xs={1} sm={2} />
      </Grid>
    );
  }
}

ResetPassword.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ResetPassword);
