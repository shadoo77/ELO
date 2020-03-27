import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  Card,
  Divider,
  Grid,
  ListItem,
  Tooltip,
  Avatar
} from "@material-ui/core/";
import { deepPurple } from "@material-ui/core/colors";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper
  },
  paperStyle: {
    padding: theme.spacing(3, 5)
  },
  divider: {
    width: 1,
    height: 48,
    //height: "100%",
    margin: 4
  },
  gridBorder: {
    borderRight: "solid #ccc 1px"
  },
  avatar: {
    margin: "0 10px",
    color: "#fff",
    cursor: "pointer",
    backgroundColor: deepPurple[500]
  },
  // headersLayout: {
  //   justifyContent: ({ headerType }) =>
  //     headerType === "avatar" ? "flex-start" : "flex-end",
  //   padding: 0
  // },
  "@media (max-width: 800px)": {
    gridBorder: {
      borderRight: "none"
    }
    // headersLayout: {
    //   justifyContent: "flex-start"
    // }
  }
}));

export default function(props) {
  const { title, subtitle, header, subtitles, headerType } = props;
  const classes = useStyles({ headerType });

  // Render teachers avatar
  const renderAvatar = data => (
    <Grid
      container
      justify="flex-start"
      alignItems="center"
      style={{
        display: "flex",
        flexWrap: "nowrap"
      }}
    >
      {data && data.length
        ? data.map((el, i) => (
            <Tooltip title={el.name} key={`avatar${i}`}>
              <Avatar className={classes.avatar}>{el.avatar}</Avatar>
            </Tooltip>
          ))
        : null}
    </Grid>
  );

  return (
    <div className={classes.root}>
      <Card style={{ marginTop: 22 }}>
        <div className={classes.paperStyle}>
          <Grid
            container
            item
            xs={12}
            spacing={1}
            direction="row"
            justify="space-between"
            alignItems="flex-start"
          >
            <Grid item className={header && classes.gridBorder}>
              {title && <Typography variant="h4">{title}</Typography>}
              {subtitle && (
                <Typography
                  variant="subtitle1"
                  component={typeof subtitle === "string" ? "p" : "div"}
                  style={{ color: "#a3a1a1" }}
                >
                  {subtitle}
                </Typography>
              )}

              {subtitles && subtitles.length
                ? subtitles.map((el, i) => (
                    <Typography
                      variant="subtitle1"
                      component="p"
                      style={{ color: "#a3a1a1" }}
                      key={`subtitles ${i}`}
                    >
                      {el}
                    </Typography>
                  ))
                : null}
            </Grid>
            <Grid
              item
              xs={12}
              sm
              container
              justify={headerType === "avatar" ? "flex-start" : "flex-end"}
              //className={classes.headersLayout}
            >
              {!header ? null : (
                <Grid item>
                  <ListItem>
                    {headerType === "avatar" ? renderAvatar(header) : header}
                  </ListItem>
                </Grid>
              )}
            </Grid>
          </Grid>
        </div>

        <Divider />
        {props.children}
      </Card>
    </div>
  );
}
