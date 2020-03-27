import React, { Component } from "react";
import { withRouter } from "react-router-dom";
// Components
import FabButton from "../../shared/inputs/fabButton";
import IntroVideo from "react-player";
// Services
import { userService } from "./../../../services/user";
import { userRoles, routeUrls } from "../../../services/config";
// Material UI
import {
  TextField,
  Grid,
  Card,
  InputAdornment,
  CardContent,
  CardActions,
  Container
} from "@material-ui/core/";
import { withStyles } from "@material-ui/core/styles";
// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faLock,
  faUser,
  faSignInAlt
} from "@fortawesome/free-solid-svg-icons";

const styles = () => ({
  root: {
    width: "640px",
    position: "relative",
    textAlign: "center",
    overflow: "visible"
  },
  iframeContainer: {
    display: "block",
    overflow: "hidden",
    borderBottomRightRadius: "0 !important",
    borderBottomLeftRadius: "0 !important",
    transform: "translateZ(0px)"
  },
  fabWrapper: {
    bottom: -40,
    position: "absolute"
  },
  errorIcon: {
    color: "#fff",
    position: "relative",
    borderRadius: "50%",
    backgroundColor: "red",
    fontSize: "30px"
  }
});

class Login extends Component {
  constructor() {
    super();
    this.state = {
      username: "CURS001",
      password: "ABCDE",
      showPassword: "****E",
      errors: {},
      loading: false
    };
  }

  handleUser = (e) => {
    this.setState({
      username: e.target.value.toUpperCase()
    });
  };

  handlePassword = (e) => {
    this.setState({
      password: e.target.value.toUpperCase(),
      showPassword: e.target.value
        .split("")
        .map((char, i) =>
          i < e.target.value.length - 1 ? "*" : char.toUpperCase()
        )
        .join("")
    });
  };

  keyPressed = (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      this.handleSubmit(e);
    }
  };

  componentDidMount() {
    // Is user still logged in?
    const user = userService.getCurrentUser();
    if (user && user.role === userRoles.STUDENT) {
      this.props.history.push(`${routeUrls.student.default}`);
    }
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    const { username, password } = this.state;
    const account = {
      username,
      password: password.toLowerCase()
    };
    try {
      const userData = await userService.login(account, userRoles.STUDENT);
      if (userData && userData.role === userRoles.TEACHER) {
        this.props.history.push(`${routeUrls.teacher.default}`);
      } else if (userData && userData.role === userRoles.STUDENT) {
        setTimeout(() => {
          this.props.history.push(`${routeUrls.student.default}`);
        }, 1400);
      } else if (userData && userData.role === userRoles.AUTHOR) {
        this.props.history.push(`${routeUrls.author.default}`);
      } else if (userData && userData.role === userRoles.ADMIN) {
        this.props.history.push(`${routeUrls.admin.default}`);
      } else {
        throw new Error("Could not determine user role!");
      }
    } catch (err) {
      let errorMessage = err;
      if (
        err.response &&
        err.response.status >= 400 &&
        err.response.status <= 499
      ) {
        errorMessage = err.response.data;
      }
      this.setState({
        errors: errorMessage,
        loading: false
      });
    }
  };

  render() {
    const { username, password, errors, loading, showPassword } = this.state;
    const { classes } = this.props;

    return (
      <Container>
        <Grid
          container
          spacing={4}
          direction="row"
          justify="center"
          alignItems="center"
          style={{
            marginTop: "10%"
          }}
        >
          <Grid container item xs={12} justify="center" alignItems="center">
            <Card className={classes.root}>
              <div className={classes.iframeContainer + " MuiPaper-rounded"}>
                <IntroVideo
                  controls
                  url="https://www.youtube.com/embed/ziypTZ7HGR4?enablejsapi=1&origin=http://localhost:3000"
                  width="100%"
                />
              </div>
              <form onSubmit={this.handleSubmit}>
                <CardContent>
                  <TextField
                    variant="outlined"
                    error={errors.username ? true : false}
                    value={username}
                    name={`${Math.random() * 9999}_user`}
                    required
                    autoFocus
                    id="user-username"
                    onChange={this.handleUser}
                    onKeyPress={this.keyPressed}
                    margin="normal"
                    style={{ marginTop: 10 }}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment
                          position="start"
                          children={
                            <FontAwesomeIcon
                              icon={faUser}
                              style={{
                                fontSize: 20
                              }}
                            />
                          }
                        />
                      ),
                      endAdornment: (
                        <InputAdornment
                          position="end"
                          children={
                            errors.username ? (
                              <FontAwesomeIcon
                                icon={faExclamationTriangle}
                                style={{
                                  fontSize: 20,
                                  color: "rgba(252, 0, 4, 1)"
                                }}
                              />
                            ) : (
                              <></>
                            )
                          }
                        />
                      )
                    }}
                  />
                  <TextField
                    variant="outlined"
                    error={errors.password ? true : false}
                    value={password.toUpperCase()}
                    name={`${Math.random() * 9999}_pass`}
                    required
                    id="author-password"
                    onChange={this.handlePassword}
                    onKeyPress={this.keyPressed}
                    margin="normal"
                    style={{ marginTop: 10 }}
                    autoComplete="off"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment
                          position="start"
                          children={
                            <FontAwesomeIcon
                              icon={faLock}
                              style={{
                                fontSize: 20
                              }}
                            />
                          }
                        />
                      ),
                      endAdornment: (
                        <InputAdornment
                          position="end"
                          children={
                            errors.password ? (
                              <FontAwesomeIcon
                                icon={faExclamationTriangle}
                                style={{
                                  fontSize: 20,
                                  color: "rgba(252, 0, 4, 1)"
                                }}
                              />
                            ) : (
                              <></>
                            )
                          }
                        />
                      )
                    }}
                  />
                </CardContent>
                <CardActions style={{ justifyContent: "center" }}>
                  <div className={classes.fabWrapper}>
                    <FabButton
                      loading={loading}
                      variant="round"
                      width="90"
                      height="90"
                      fabSize="large"
                      icon={
                        <FontAwesomeIcon
                          icon={faSignInAlt}
                          style={{
                            fontSize: 20
                          }}
                        />
                      }
                      iconSize="large"
                      iconFontSize="50"
                      spinnerSize={100}
                      clickHandler={this.handleSubmit}
                    />
                  </div>
                </CardActions>
              </form>
            </Card>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

export default withStyles(styles)(withRouter(Login)); // withStyles(styles)(UserLogin);
