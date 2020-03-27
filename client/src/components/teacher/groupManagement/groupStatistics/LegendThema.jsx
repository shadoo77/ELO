import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListSubheader
} from "@material-ui/core/";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    maxWidth: 400
  },
  legendFilled: {
    width: 24,
    height: 24,
    margin: 0,
    padding: 0,
    borderRadius: "5px",
    border: "solid 1px #ccc"
  }
}));

export default () => {
  const classes = useStyles();

  return (
    <List
      component="nav"
      dense
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Let op :
        </ListSubheader>
      }
      className={classes.root}
    >
      <ListItem button>
        <ListItemIcon>
          <span
            className={classes.legendFilled}
            style={{ backgroundColor: "green" }}
          />
        </ListItemIcon>
        <ListItemText primary="100% goed" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <span
            className={classes.legendFilled}
            style={{ backgroundColor: "#a9ff4f" }}
          />
        </ListItemIcon>
        <ListItemText primary="75 - 99% afgerond" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <span
            className={classes.legendFilled}
            style={{ backgroundColor: "red" }}
          />
        </ListItemIcon>
        <ListItemText primary="0 - 74% afgerond" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <span
            className={classes.legendFilled}
            style={{ backgroundColor: "#ccc" }}
          />
        </ListItemIcon>
        <ListItemText primary="Begonnen, niet afgerond" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <span
            className={classes.legendFilled}
            style={{ backgroundColor: "#fff" }}
          />
        </ListItemIcon>
        <ListItemText primary="Niet begonnen" />
      </ListItem>
    </List>
  );
};
