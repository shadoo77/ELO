import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
// Data
import { useResource } from "rest-hooks";
// Shapes
import StatisticsResource from "shapes/statistics.shape";
// Components
//import ProgressBar from "./utils/progressBar";
import ProgressBar from "./utils/ProgressBar.1";
import ExpandedRow from "./utils/ExpandedRow";
import SearchBox from "../../../shared/inputs/expand-searchbox";
// Services
import { routeUrls, tagLevels } from "services/config";
import { searchFilterResource } from "services/results-filters";
// Material UI
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Box,
  Divider,
  Typography,
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip
} from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    width: "100%",
    overflowY: "auto"
  },
  itemsBarContainer: {
    flexWrap: "nowrap",
    margin: 6
  },
  cellStyle: {
    width: "150px",
    flexShrink: 0,
    flexGrow: "1",
    padding: "0.5px"
  }
});

export default props => {
  const { data, currentGroupId, currentStudentId } = props;
  const { group } = data;
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  // Filter search
  const filterChange = val => {
    setFilter(val);
  };

  const clearSearch = () => {
    setFilter("");
  };

  useEffect(() => {
    if (data.stats && data.stats.length) setLoading(false);
    else setLoading(true);
  }, [data.stats]);

  const searchFilter = () => {
    return (
      <React.Fragment>
        <SearchBox
          handleChange={filterChange}
          clearSearch={clearSearch}
          value={filter}
        />
        <Divider />
      </React.Fragment>
    );
  };

  const searchValue = filter;
  const searchPath = "user";
  const searchKey = "name";

  const filteredStudents = searchFilterResource(
    data.stats,
    searchPath,
    searchKey,
    searchValue
  );

  const renderStatisticsData = paragraphs => {
    return (
      <Box
        display="flex"
        justifyContent="space-between"
        flexWrap="nowrap"
        className={classes.root}
      >
        {paragraphs.map(paragraph => {
          const linkTo = !currentStudentId
            ? `${routeUrls.teacher.group.statistics}/group/${currentGroupId}/branch/${paragraph.tag._id}/depthLevel/${tagLevels.ASSIGNMENT}`
            : `${routeUrls.teacher.group.statistics}/group/${currentGroupId}/branch/${paragraph.tag._id}/depthLevel/${tagLevels.ASSIGNMENT}/student/${currentStudentId}`;
          return (
            <Box
              flexShrink={0}
              key={paragraph._id}
              className={classes.itemsBarContainer}
            >
              <Box className={classes.cellStyle}>
                <Link to={linkTo}>
                  <Tooltip title={paragraph.tag.value}>
                    <div>
                      <ProgressBar
                        correct={paragraph.correct}
                        wrong={paragraph.wrong}
                        attempts={paragraph.attempts}
                        alignment={"horizontal"}
                        isActive={paragraph ? true : false}
                      />
                    </div>
                  </Tooltip>
                </Link>
              </Box>
            </Box>
          );
        })}
      </Box>
    );
  };

  const renderStudentRow = (paragraphs, studentInfo) => {
    return (
      <Grid item container xs={12}>
        {!currentStudentId ? (
          <ExpandedRow
            header={
              <ListItem style={{ padding: 0 }}>
                <ListItemAvatar>
                  <Avatar style={{ backgroundColor: "#555" }}>
                    {studentInfo.name.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={studentInfo.name} />
              </ListItem>
            }
          >
            {paragraphs ? renderStatisticsData(paragraphs) : <p>No data!</p>}
          </ExpandedRow>
        ) : (
          <>{paragraphs ? renderStatisticsData(paragraphs) : <p>No data!</p>}</>
        )}
      </Grid>
    );
  };

  function filterData(dataList) {
    const isFound = group.students.some(el => el === currentStudentId);
    if (currentStudentId && isFound) {
      return dataList.filter(el => el.user._id === currentStudentId);
    }
    return dataList;
  }

  const dataList = filterData(filteredStudents);

  const renderListStudents = data => {
    return data.map((student, index) => {
      return (
        <React.Fragment key={student.user._id}>
          <Grid container item xs={12}>
            {renderStudentRow(student.paragraphs, student.user)}
          </Grid>
          {index === dataList.length - 1 ? null : (
            <Box px={2} width={1}>
              <Divider />
            </Box>
          )}
        </React.Fragment>
      );
    });
  };

  const render = () => (
    <div style={{ width: "100%" }}>
      {!dataList.length ? (
        <Box p={3} width={1}>
          <Typography>
            Er zijn geen student die zijn naam bevat {filter}
          </Typography>
        </Box>
      ) : (
        renderListStudents(dataList)
      )}
    </div>
  );

  return (
    <Grid
      container
      direction="row"
      justify="flex-start"
      alignItems="center"
      spacing={1}
    >
      {currentStudentId ? null : (
        <Grid item xs={12}>
          <Box p={3}>{searchFilter()}</Box>
        </Grid>
      )}
      {loading ? <p>loading ..</p> : data.stats && group && render()}
    </Grid>
  );
};
