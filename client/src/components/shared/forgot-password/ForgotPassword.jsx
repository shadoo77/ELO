import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";
import PropTypes from "prop-types";
import { apiUrl, routeUrls } from "../../../services/config";
import { httpService } from "../../../services/http";
import { withStyles } from "@material-ui/core/styles";
import {
  Typography,
  FormHelperText,
  Button,
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
  LinearProgress,
  Divider,
  Link
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
  notFound: {
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

const CollisionLink = React.forwardRef((props, ref) => (
  <RouterLink innerRef={ref} to={props.to} {...props} />
));

class PasswordForgot extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      messageFromServer: "",
      errors: {},
      loading: false
    };
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async e => {
    e.preventDefault();
    const { email } = this.state;
    this.setState({ loading: true });
    try {
      const results = await httpService.post(`${apiUrl}/auth/forgot-password`, {
        email
      });
      this.setState({
        email: "",
        messageFromServer: results.data.success,
        loading: false,
        errors: {}
      });
    } catch (err) {
      this.setState({
        errors: err.response.data,
        loading: false
      });
    }
  };

  render() {
    const { email, messageFromServer, errors, loading } = this.state;
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
            <CardHeader title="Wachtwoord vergeten" />
            {/* If the account is not activated here is the feedback */}
            {errors.notFound ? (
              <FormHelperText className={classes.notFound}>
                {errors.notFound}
              </FormHelperText>
            ) : messageFromServer ? (
              <FormHelperText className={classes.sentSuccessful}>
                {messageFromServer}
              </FormHelperText>
            ) : null}

            <CardContent className={classes.cardContent}>
              <Typography component="p" align="left">
                Vul uw emailadres in, en u ontvangt per e-mail de instructies
                hoe u een nieuw wachtwoord maakt.
              </Typography>
              <form onSubmit={this.handleSubmit}>
                <TextField
                  variant="outlined"
                  placeholder="author@kleurrijker.nl"
                  error={errors.email || errors.notFound ? true : false}
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

                {loading ? (
                  <LinearProgress className={classes.linearProgress} />
                ) : (
                  <Divider className={classes.linearProgress} />
                )}
                <CardActions>
                  <Button
                    variant="contained"
                    type="submit"
                    color="primary"
                    size="large"
                    onClick={this.handleSubmit}
                    fullWidth={true}
                    disabled={loading}
                  >
                    Verstuur instructies
                  </Button>
                </CardActions>
              </form>
            </CardContent>
            <CardActions>
              <List color="primary" className={classes.listContainer}>
                <ListItem className={classes.listItem}>
                  <ListItemIcon>
                    <Icon color="primary">keyboard_backspace</Icon>
                  </ListItemIcon>
                  <Link
                    to={`${routeUrls.admin.auth.login}`}
                    component={CollisionLink}
                  >
                    Terug naar login pagina
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

PasswordForgot.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(PasswordForgot);
