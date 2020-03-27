import React from "react";
// Config
import { difficultyTypes } from "services/config";
// Material ui
import { Grid } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
// Cell component
import Cell from "./CellData";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  table: {
    flexGrow: 1,
    width: "100%",
    padding: 0
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  }
}));

function getDataInLevels(data) {
  const easyData = data.filter(
    el => el.difficulty === difficultyTypes.BEGINNER
  );
  const normalData = data.filter(
    el => el.difficulty === difficultyTypes.INTERMEDIATE
  );
  const hardData = data.filter(
    el => el.difficulty === difficultyTypes.ADVANCED
  );
  return [
    { level: "*", data: easyData },
    { level: "**", data: normalData },
    { level: "***", data: hardData }
  ];
}

export default props => {
  const classes = useStyles();
  const {
    statisticsData,
    studentName,
    tree,
    branchId,
    studentId,
    groupRender
  } = props;
  const dataStructure = getDataInLevels(statisticsData);

  return (
    <div className={classes.root}>
      <Grid container spacing={1} justify="center" alignItems="center">
        {groupRender ? (
          <Grid item xs={3} sm={1} style={{ padding: 0 }}>
            {studentName}
          </Grid>
        ) : null}
        <Grid
          item
          container
          xs={studentName ? 9 : 12}
          sm={studentName ? 11 : 12}
          spacing={1}
          className={classes.table}
        >
          <Cell
            tree={tree}
            branchId={branchId}
            data={dataStructure}
            studentId={studentId}
          />
        </Grid>
      </Grid>
    </div>
  );
};
