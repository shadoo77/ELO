import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";
import PropTypes from "prop-types";
import { userService } from "../../services/user";
import { userRoles, routeUrls } from "../../services/config";
import { withStyles } from "@material-ui/core/styles";
import {
  FormHelperText,
  Button,
  TextField,
  Grid,
  Card,
  CardHeader,
  IconButton,
  Icon,
  CardContent,
  List,
  ListItemIcon,
  ListItem,
  CardActions,
  LinearProgress,
  Divider,
  Link
} from "@material-ui/core/";

const styles = () => ({
  gridContainer: {
    fontFamily: '"Helvetica", "Arial", sans-serif',
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
  notActivated: {
    borderRadius: "3px",
    border: "solid 1px #8e3030",
    backgroundColor: "#f2dada",
    color: "#8e3030",
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

const CollisionLink = React.forwardRef((props, ref) => (
  <RouterLink innerRef={ref} to={props.to} {...props} />
));

class UserLogin extends Component {
  constructor() {
    super();
    this.state = {
      email: "hans@kleurrijker.nl",
      username: "hans",
      password: "abcde",
      errors: {},
      loading: false
    };
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async e => {
    e.preventDefault();
    const { email, username, password } = this.state;
    const account = { email, username, password };
    this.setState({ loading: true });

    try {
      const userData = await userService.login(account, "user");
      if (userData && userData.role === userRoles.TEACHER) {
        this.props.history.push(`${routeUrls.teacher.default}`);
      } else if (userData && userData.role === userRoles.STUDENT) {
        this.props.history.push(`${routeUrls.student.default}`);
      } else if (userData && userData.role === userRoles.AUTHOR) {
        this.props.history.push(`${routeUrls.author.default}`);
      } else if (userData && userData.role === userRoles.ADMIN) {
        this.props.history.push(`${routeUrls.admin.default}`);
      } else {
        alert("Something goes wrong!");
      }
    } catch (err) {
      if (
        (err.response && err.response.status === 400) ||
        err.response.status === 404 ||
        err.response.status === 403
      ) {
        this.setState({
          errors: err.response.data,
          loading: false
        });
      }
    }
  };

  render() {
    const { email, username, password, errors, loading } = this.state;
    const { classes } = this.props;
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
            <IconButton
              className={classes.iconButton}
              style={{ cursor: "default" }}
            >
              <Icon>lock_open</Icon>
            </IconButton>
            <CardHeader title="User Login" />
            {/* If the account is not activated here is the feedback */}
            {errors.notActivated ? (
              <FormHelperText className={classes.notActivated}>
                {errors.notActivated}
              </FormHelperText>
            ) : null}

            <CardContent className={classes.cardContent}>
              <form onSubmit={this.handleSubmit}>
                <TextField
                  variant="outlined"
                  placeholder="author@kleurrijker.nl"
                  error={errors.email ? true : false}
                  helperText={errors.email}
                  value={email}
                  name="email"
                  required
                  id="email-login"
                  label="Email"
                  onChange={this.handleChange}
                  margin="dense"
                  className={classes.inputField}
                  fullWidth
                />
                <TextField
                  variant="outlined"
                  placeholder="author1"
                  error={errors.username ? true : false}
                  helperText={errors.username}
                  value={username}
                  name="username"
                  required
                  id="username-login"
                  label="Username"
                  onChange={this.handleChange}
                  margin="dense"
                  className={classes.inputField}
                  fullWidth
                  disabled
                />
                <TextField
                  variant="outlined"
                  placeholder="Author1"
                  error={errors.password ? true : false}
                  helperText={errors.password}
                  value={password}
                  name="password"
                  required
                  type="password"
                  id="password-login"
                  label="Password"
                  onChange={this.handleChange}
                  margin="dense"
                  className={classes.inputField}
                  fullWidth
                />
                {loading ? (
                  <LinearProgress className={classes.linearProgress} />
                ) : (
                  <Divider className={classes.linearProgress} />
                )}
                <Button
                  variant="contained"
                  type="submit"
                  color="primary"
                  size="large"
                  onClick={this.handleSubmit}
                  fullWidth={true}
                  disabled={loading}
                >
                  Login
                </Button>
              </form>
            </CardContent>
            <CardActions>
              <List color="primary" className={classes.listContainer}>
                <ListItem className={classes.listItem}>
                  <ListItemIcon>
                    <Icon color="primary" style={{ fontSize: 16 }}>
                      send
                    </Icon>
                  </ListItemIcon>
                  <Link
                    to={`${routeUrls.admin.auth.register}`}
                    component={CollisionLink}
                  >
                    Registreren
                  </Link>
                </ListItem>
                <ListItem className={classes.listItem}>
                  <ListItemIcon>
                    <Icon color="primary" style={{ fontSize: 16 }}>
                      send
                    </Icon>
                  </ListItemIcon>
                  <Link
                    to={`${routeUrls.admin.auth.forgotpassword}`}
                    component={CollisionLink}
                  >
                    Wachtwoord vergeten
                  </Link>
                </ListItem>
              </List>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={1} sm={2} />
      </Grid>
    );
  }
}

UserLogin.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(UserLogin);
