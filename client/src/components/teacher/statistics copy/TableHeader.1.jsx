import React from "react";
import { Link } from "react-router-dom";
// Services
import { routeUrls } from "services/config";
// Material ui
import { Grid, Tooltip } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  // root: {
  //   width: "100%",
  //   display: "flex",
  //   flexDirection: "row",
  //   flexWrap: "wrap",
  //   overflow: "auto"
  // },
  itemsBarContainer: {
    flexWrap: "nowrap"
  },
  cellStyle: {
    width: "50px",
    flexShrink: 0
  }
});

export default props => {
  const { titleRow, groupId } = props;
  const classes = useStyles();

  return (
    <React.Fragment>
      <Grid item xs={1} style={{ margin: 0 }}>
        {" "}
      </Grid>
      <Grid item container xs={11} className={classes.itemsBarContainer}>
        {titleRow &&
          titleRow.length &&
          titleRow.map((el, i) => (
            <Grid
              item
              container
              justify="center"
              key={"title" + i + el.id}
              className={classes.cellStyle}
            >
              <Tooltip title={el.value}>
                <Link
                  to={`${routeUrls.teacher.group.statusTest}/${groupId}/depth/${el.depthLevel}/branch/${el.id}`}
                >
                  <div>{el.value.charAt(0) + (i + 1)}</div>
                </Link>
              </Tooltip>
            </Grid>
          ))}
      </Grid>
    </React.Fragment>
  );
};
