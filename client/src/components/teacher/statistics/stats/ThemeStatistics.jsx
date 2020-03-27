import React, { useState } from "react";
import { Link } from "react-router-dom";
// Components
//import ProgressBar from "./utils/progressBar";
import ProgressBar from "./utils/ProgressBar.1";
import ExpandedRow from "./utils/ExpandedRow";
import SearchBox from "../../../shared/inputs/expand-searchbox";
// Services
import { routeUrls, difficultyTypes, tagLevels } from "services/config";
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
    width: "90px",
    flexShrink: 0,
    flexGrow: "1",
    padding: "0.5px"
  }
});

export default props => {
  const { data, currentGroupId, currentStudentId } = props;
  const { group } = data;
  const classes = useStyles();
  const [filter, setFilter] = useState("");
  // Filter search
  const filterChange = val => {
    setFilter(val);
  };

  const clearSearch = () => {
    setFilter("");
  };

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

  const getDataInLevels = data => {
    const easyData = data.filter(
      el => el.tag.difficulty === difficultyTypes.BEGINNER
    );
    const mediumData = data.filter(
      el => el.tag.difficulty === difficultyTypes.INTERMEDIATE
    );
    const hardData = data.filter(
      el => el.tag.difficulty === difficultyTypes.ADVANCED
    );
    return { easyData, mediumData, hardData };
  };

  const oneLevelStatstics = difficulty => {
    return (
      <Grid container className={classes.itemsBarContainer}>
        {difficulty.map(el => {
          const linkTo = !currentStudentId
            ? `${routeUrls.teacher.group.statistics}/group/${currentGroupId}/branch/${el.tag._id}/depthLevel/${tagLevels.PARAGRAPH}`
            : `${routeUrls.teacher.group.statistics}/group/${currentGroupId}/branch/${el.tag._id}/depthLevel/${tagLevels.PARAGRAPH}/student/${currentStudentId}`;
          return (
            <Grid className={classes.cellStyle} item key={el.tag._id}>
              <Link to={linkTo}>
                <Tooltip title={el.tag.value}>
                  <div>
                    <ProgressBar
                      correct={el.correct}
                      wrong={el.wrong}
                      attempts={el.attempts}
                      alignment={"horizontal"}
                      isActive={el ? true : false}
                    />
                  </div>
                </Tooltip>
              </Link>
            </Grid>
          );
        })}
      </Grid>
    );
  };

  const renderStatsOfOneThema = (themas, index) => {
    const { easyData, mediumData, hardData } = getDataInLevels(themas);
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        flexWrap="wrap"
        width={1}
      >
        <Box flexShrink={0} width={1}>
          <div className={`${classes.itemsBarContainer} ${classes.cellStyle}`}>
            <center>{`Thema${index}`}</center>
            {/** easyData[0].tag.value **/}
          </div>
        </Box>
        <Box flexShrink={0} width={1}>
          {oneLevelStatstics(easyData)}
        </Box>
        <Box flexShrink={0} width={1}>
          {oneLevelStatstics(mediumData)}
        </Box>
        <Box flexShrink={0} width={1}>
          {oneLevelStatstics(hardData)}
        </Box>
      </Box>
    );
  };

  function filterBy(themes, key) {
    const allKeys = themes.map(thema => thema.tag[key]);
    return allKeys.filter((item, index) => {
      return allKeys.indexOf(item) === index;
    });
  }

  const renderStatisticsData = themes => {
    const bridgeIds = filterBy(themes, "bridgeId");
    let themas = [];
    bridgeIds.forEach(bridgeId => {
      const themePerBridgeId = themes.filter(
        el => el.tag.bridgeId === bridgeId
      );
      const element = { bridgeId: bridgeId, nodes: themePerBridgeId };
      themas.push(element);
    });

    return (
      <Box
        display="flex"
        justifyContent="flex-start"
        flexWrap="nowrap"
        className={classes.root}
      >
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          flexWrap="wrap"
          style={{
            margin: 6,
            padding: "0.5px"
          }}
        >
          <Box width={1} style={{ padding: "0.5px", height: 30 }}>
            <Box style={{ textAlign: "center" }}> </Box>
          </Box>
          <Box width={1} style={{ padding: "0.5px", height: 30 }}>
            <Box style={{ textAlign: "center" }}>*</Box>
          </Box>
          <Box width={1} style={{ padding: "0.5px", height: 30 }}>
            <Box style={{ textAlign: "center" }}>**</Box>
          </Box>
          <Box width={1} style={{ padding: "0.5px", height: 30 }}>
            <Box style={{ textAlign: "center" }}>***</Box>
          </Box>
        </Box>
        {themas.map((thema, index) => (
          <Box
            flexGrow={1}
            flexShrink={0}
            key={thema.bridgeId}
            className={classes.itemsBarContainer}
          >
            {renderStatsOfOneThema(thema.nodes, index + 1)}
          </Box>
        ))}
      </Box>
    );
  };

  const renderStudentRow = (studentData, studentInfo) => {
    return (
      <Box display="flex" justifyContent="flex-start" flexWrap="wrap" width={1}>
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
            {studentData ? renderStatisticsData(studentData) : <p>No data!</p>}
          </ExpandedRow>
        ) : (
          <>
            {studentData ? renderStatisticsData(studentData) : <p>No data!</p>}
          </>
        )}
      </Box>
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
            {renderStudentRow(student.themes, student.user)}
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
      {data && group && render()}
    </Grid>
  );
};
