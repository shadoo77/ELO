import React, { Component } from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
// Services
import { routeUrls, tagLevels } from "services/config";
import { userService } from "services/user";
import { backendService } from "services/backend";
// Material UI
import { withStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  List,
  ListItem,
  Collapse
} from "@material-ui/core/";
import MenuIcon from "@material-ui/icons/Menu";
import { NavbarStyles } from "../student.theme";
// Resources
import logo from "./../../../assets/images/logo.png";
// CSS
import "./navbar.css";

class NavBar extends Component {
  state = {
    mobileMenu: false,
    links: [
      [],
      [],
      [{ name: "adminlink1", to: "adminlink1" }],
      [{ name: "authorLink1", to: "authorLink1" }]
    ]
  };

  async componentDidMount() {
    try {
      const alfa = await backendService.getAlfaRoot();
      const currentState = this.state;
      currentState.links[userService.getUserRole()][0] = {
        name: "Alfa Contents",
        to: `${routeUrls.teacher.alfaContents}/branch/${alfa._id}/depthLevel/${tagLevels.PUBLICATION}`
      };
      this.setState(currentState);
    } catch (error) {
      console.log(error);
    }
  }

  handleLogOut() {
    userService.logout();
  }

  menuToggle = () => {
    this.setState(state => ({
      mobileMenu: !state.mobileMenu
    }));
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="sticky" className={classes.appBar}>
          <Toolbar className="kleurrijker-nav">
            {/* Mobile icon */}
            <IconButton
              onClick={this.menuToggle}
              color="inherit"
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>

            {/* Desktop Logo */}
            <IconButton
              className={classes.menuButtonLogoNormal}
              color="inherit"
              aria-label="Menu"
            >
              <NavLink to={`${routeUrls.student.default}`}>
                <img
                  src={logo}
                  alt="Logo"
                  style={{ width: "2em", height: "2em" }}
                />
              </NavLink>
            </IconButton>

            {/* Desktop Items */}
            <Typography
              variant="h6"
              color="inherit"
              className={classes.menuItems}
            >
              {userService.getUserRole() !== null &&
              userService.getUserRole() > -1
                ? this.state.links[userService.getUserRole()].map(link => (
                    <Button color="inherit" key={link.name}>
                      <NavLink to={link.to}>{link.name}</NavLink>
                    </Button>
                  ))
                : null}
            </Typography>

            {/* Mobile Logo: Kleurrijker */}
            <Typography
              variant="h6"
              color="inherit"
              className={classes.menuItemsMob}
            >
              <IconButton
                color="inherit"
                aria-label="Menu"
                className={classes.menuButtonLogoMob}
              >
                <NavLink to={`${routeUrls.student.default}`}>
                  <img
                    src={logo}
                    alt="Logo"
                    style={{ width: "2em", height: "2em" }}
                  />
                </NavLink>
              </IconButton>
            </Typography>

            {userService.getCurrentUser() ? (
              <Button
                variant="contained"
                color="secondary"
                onClick={this.handleLogOut}
              >
                Logout
              </Button>
            ) : null}
          </Toolbar>

          <List className={classes.mobMenuItems}>
            <Collapse in={this.state.mobileMenu} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {userService.getUserRole()
                  ? this.state.links[userService.getUserRole()].map(link => (
                      <NavLink to={link.to} key={link.name}>
                        <ListItem button className={classes.mobSingleItem}>
                          {link.name}
                        </ListItem>
                      </NavLink>
                    ))
                  : null}
              </List>
            </Collapse>
          </List>
        </AppBar>
      </div>
    );
  }
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(NavbarStyles)(NavBar);
