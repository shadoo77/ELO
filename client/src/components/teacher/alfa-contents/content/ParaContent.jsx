import React from "react";
// Services
import { bucketUrl, alfaContentTypes } from "services/config";
// Material ui
import {
  Box,
  ListItemIcon,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
  IconButton,
  ListItemSecondaryAction,
  Fab
} from "@material-ui/core/";
import { makeStyles } from "@material-ui/styles";
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
  }
}));

function CatygoryIcon({ iconColor, iconEmo: IconEmo }) {
  return (
    <IconButton size="small" edge="start" style={{ color: iconColor }}>
      <IconEmo />
    </IconButton>
  );
}

export default ({ content, paragraph }) => {
  const classes = useStyles();

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

  return (
    <Box width={8 / 10} mx={"auto"} mt={2}>
      <Paper>
        <List component="nav" className={classes.root}>
          <ListItem>
            <ListItemIcon>{categoryIcon(content.type)}</ListItemIcon>
            <ListItemText
              primary={paragraph + " " + categoryName(content.type)}
            />
          </ListItem>
          {content.items && content.items.length ? (
            content.items.map((item, i) => (
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
                {i === content.items.length - 1 ? null : <Divider />}
              </React.Fragment>
            ))
          ) : (
            <center>Geen items</center>
          )}
        </List>
      </Paper>
    </Box>
  );
};
