import React from "react";
import { Link } from "react-router-dom";
// Services
import { tagLevels, routeUrls } from "services/config";
// Material ui
import {
  Box,
  ListSubheader,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper
} from "@material-ui/core/";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%"
  },
  nested: {
    paddingLeft: theme.spacing(4)
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  }
}));

export default props => {
  const { paragraphs } = props;
  const classes = useStyles();

  return (
    <Box width={8 / 10} mx={"auto"} mt={2}>
      <Paper>
        <List
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Alle paragrafen
            </ListSubheader>
          }
          className={classes.root}
        >
          {paragraphs.map((paragraph, i) => (
            <React.Fragment key={paragraph._id}>
              <ListItem
                button
                component={Link}
                to={`${routeUrls.teacher.alfaContents}/branch/${paragraph._id}/depthLevel/${tagLevels.PARAGRAPH}`}
              >
                <ListItemText primary={paragraph.value} />
              </ListItem>
              {i === paragraphs.length - 1 ? null : <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
};
