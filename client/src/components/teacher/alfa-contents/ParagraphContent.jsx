import React from "react";
import { Link } from "react-router-dom";
// Services
import { routeUrls, alfaContentLevels } from "services/config";
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
  const { paragraphContent } = props;
  const classes = useStyles();

  return (
    <Box width={8 / 10} mx={"auto"} mt={2}>
      <Paper>
        <List
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Paragraphs
            </ListSubheader>
          }
          className={classes.root}
        >
          {paragraphContent.map((paragraph, i) => (
            <React.Fragment key={paragraph._id}>
              <ListItem
                button
                component={Link}
                to={`${routeUrls.teacher.alfaContents}/branch/${paragraph._id}/depthLevel/${alfaContentLevels.SUB_PARAGRAPH}`}
              >
                <ListItemText primary={paragraph.paragrafRef} />
              </ListItem>
              {i === paragraphContent.length - 1 ? null : <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
};
