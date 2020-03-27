import React from "react";
import { Link } from "react-router-dom";
// Services
import { routeUrls } from "services/config";
// Material ui
import { Grid, Tooltip } from "@material-ui/core/";

export default props => {
  const { studentName, titleRow, groupId } = props;
  return (
    <React.Fragment>
      <Grid item xs={!studentName ? 1 : false} style={{ margin: 0 }}>
        {!studentName ? " " : null}
      </Grid>
      <Grid item container xs={!studentName ? 11 : 12}>
        {titleRow &&
          titleRow.length &&
          titleRow.map((el, i) => (
            <Grid item container justify="center" xs key={"title" + i + el.id}>
              <Tooltip title={el.value}>
                <Link
                  to={`${routeUrls.teacher.group.statusTest}/${groupId}/branch/${el.id}`}
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
