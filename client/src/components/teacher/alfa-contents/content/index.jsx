import React from "react";
// Services
import { bucketUrl } from "services/config";
// Material ui
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Typography,
  Paper,
  Fab
} from "@material-ui/core/";
import { makeStyles } from "@material-ui/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

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
  },
  title: {
    padding: theme.spacing(3, 2)
  }
}));

export default ({ content }) => {
  const { value, children } = content;
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const categoryList = items => {
    return items.length ? (
      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        className={classes.root}
      >
        {items.map((item, i) => (
          <React.Fragment key={item._id}>
            <ListItem>
              <ListItemText primary={item.src} />
              <ListItemSecondaryAction>
                <Fab
                  variant="extended"
                  size="small"
                  color="secondary"
                  onClick={() =>
                    window.open(`${bucketUrl}/${item.src}`, "_blank")
                  }
                >
                  View File
                </Fab>
              </ListItemSecondaryAction>
            </ListItem>
            {i === items.length - 1 ? null : <Divider />}
          </React.Fragment>
        ))}
      </List>
    ) : (
      <p>Geen items</p>
    );
  };

  return (
    <Box width={8 / 10} mx={"auto"} mt={5}>
      <Paper className={classes.title}>
        <Typography variant="h5" component="h3">
          {value}
        </Typography>
      </Paper>
      {children.map((para, i) => (
        <ExpansionPanel
          expanded={expanded === `panel${i + 1}`}
          onChange={handleChange(`panel${i + 1}`)}
          key={para._id}
        >
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography className={classes.heading}>{para.value}</Typography>
            <Typography className={classes.secondaryHeading}>
              {`${para.value} ${value}`}
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Box width={1} display="flex" flexGrow="1">
              {categoryList(para.children)}
            </Box>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ))}
    </Box>
  );
};
