import React from "react";
// Services
import { alfaContentTypes, bucketUrl } from "services/config";
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
  IconButton,
  Fab
} from "@material-ui/core/";
import { makeStyles } from "@material-ui/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import VideoLibraryIcon from "@material-ui/icons/VideoLibrary";
import AudiotrackIcon from "@material-ui/icons/Audiotrack";
import LanguageIcon from "@material-ui/icons/Language";
import MovieIcon from "@material-ui/icons/Movie";

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

function CatygoryIcon({ iconColor, iconEmo: IconEmo }) {
  return (
    <IconButton size="small" edge="start" style={{ color: iconColor }}>
      <IconEmo />
    </IconButton>
  );
}

export default props => {
  const { paragraph } = props;
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const categoryName = type => {
    return type === alfaContentTypes.FILMPJE
      ? "Filmpjes"
      : type === alfaContentTypes.TAALBEAT
      ? "Taalbeats"
      : type === alfaContentTypes.LIEDJE
      ? "Liedjes"
      : "Audio Fragmenten";
  };

  const categoryIcon = type => {
    return type === alfaContentTypes.FILMPJE ? (
      <CatygoryIcon iconColor="#dd0055" iconEmo={VideoLibraryIcon} />
    ) : type === alfaContentTypes.TAALBEAT ? (
      <CatygoryIcon iconColor="#3c8039" iconEmo={LanguageIcon} />
    ) : type === alfaContentTypes.LIEDJE ? (
      <CatygoryIcon iconColor="#1a73e8" iconEmo={AudiotrackIcon} />
    ) : (
      <CatygoryIcon iconColor="#4ec4a6" iconEmo={MovieIcon} />
    );
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
          Fragmenten van paragraaf {paragraph.paragrafRef}
        </Typography>
      </Paper>
      {paragraph.content.map((el, i) => (
        <ExpansionPanel
          expanded={expanded === `panel${i + 1}`}
          onChange={handleChange(`panel${i + 1}`)}
          key={`panel${i + 1}`}
        >
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography className={classes.heading}>
              {categoryIcon(el.type)}
              {categoryName(el.type)}
            </Typography>
            <Typography className={classes.secondaryHeading}>
              {`Hier ziet u alle ${categoryName(el.type)}`}
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Box width={1} display="flex" flexGrow="1">
              {categoryList(el.items)}
            </Box>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ))}
    </Box>
  );
};
