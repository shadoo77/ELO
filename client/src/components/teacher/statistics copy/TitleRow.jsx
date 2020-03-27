import React from "react";
import { Link, withRouter } from "react-router-dom";
// Services
import { routeUrls } from "services/config";
// Material ui
import { Grid } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  table: {
    flexGrow: 1,
    width: "100%",
    padding: 0
  },
  cellStyle: {
    textAlign: "center",
    color: theme.palette.text.secondary
  }
}));

function TitleRow(props) {
  const { data, groupRender } = props;
  const { groupId } = props.match.params;
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid container spacing={1} justify="center" alignItems="center">
        {groupRender ? (
          <Grid item xs={3} sm={2} style={{ padding: 0 }}>
            &nbsp;
          </Grid>
        ) : null}
        <Grid
          item
          container
          xs={groupRender ? 9 : 12}
          sm={groupRender ? 10 : 12}
          spacing={1}
          className={classes.table}
        >
          <div style={{ width: "100%", padding: "0 15px" }}>
            <Grid container spacing={2} justify="center" alignItems="center">
              <Grid item xs={1} style={{ padding: 0 }}>
                &nbsp;
              </Grid>
              <Grid
                item
                container
                xs={11}
                spacing={1}
                className={classes.table}
              >
                {data && data.length
                  ? data.map((item, i) => (
                      <Grid
                        item
                        xs
                        className={classes.cellStyle}
                        key={"title" + i + item.id}
                      >
                        <Link
                          to={`${routeUrls.teacher.group.statusTest}/${groupId}/branch/${item.id}`}
                        >
                          <div>{item.value}</div>
                        </Link>
                      </Grid>
                    ))
                  : null}
              </Grid>
            </Grid>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
export default withRouter(TitleRow);
