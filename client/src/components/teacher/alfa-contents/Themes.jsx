import React from "react";
import { Link } from "react-router-dom";
// Services
import { tagLevels, routeUrls } from "services/config";
// Material ui
import {
  ListSubheader,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Paper
} from "@material-ui/core/";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  nested: {
    paddingLeft: theme.spacing(4)
  }
}));

export default props => {
  const { themes } = props;
  const classes = useStyles();
  return (
    <Box width={8 / 10} mx={"auto"} mt={2}>
      <Paper>
        <List
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Alle thema's
            </ListSubheader>
          }
          className={classes.root}
        >
          {themes.map((theme, i) => (
            <React.Fragment key={theme._id}>
              <ListItem
                button
                component={Link}
                to={`${routeUrls.teacher.alfaContents}/branch/${theme._id}/depthLevel/${tagLevels.THEME}`}
              >
                <ListItemText primary={theme.value} />
              </ListItem>
              {i === themes.length - 1 ? null : <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
};
