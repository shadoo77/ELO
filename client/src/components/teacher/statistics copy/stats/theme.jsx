import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
// Data
import { useResource } from "rest-hooks";
// Shapes
import ThemeStatsResource from "shapes/~stats.theme";
// Components
import ProgressBar from "./utils/progressBar";
// Services
import { routeUrls } from "services/config";
import { getChildrenOfItem } from "services/searchInTree";
// Material UI
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Grid, Box } from "@material-ui/core";

const useStyles = makeStyles((theme) => createStyles({}));

function ThemeStats(props) {
  const classes = useStyles();

  const interactions = useResource(ThemeStatsResource.listShape(), {
    parentId: props.currentParentId,
    groupId: props.currentGroupId
  });

  const getStudentFromGroup = (studentId) => {
    return props.group.students.find((student) => student._id === studentId);
  };

  const renderProgressBar = (paragraph, student) => {
    const result = interactions.find((interaction) => {
      return (
        interaction.parent === paragraph._id && interaction.user === student._id
      );
    });
    return (
      <Link
        to={`${routeUrls.teacher.group.statusTest}/${props.currentGroupId}/branch/${paragraph._id}/student/${student._id}`}
      >
        <Box flexGrow={1} key={`${paragraph._id}`}>
          <ProgressBar
            interaction={result}
            isDisabled={typeof result === "undefined"}
          />
        </Box>
      </Link>
    );
  };

  const renderTheme = (theme, student) => {
    return theme.children.map((childParagraph) => (
      <Box width={1 / 30}>{renderProgressBar(childParagraph, student)}</Box>
    ));
  };

  const renderStudent = (themes, studentId) => {
    const student = getStudentFromGroup(studentId);

    return (
      <Grid container>
        <Grid item xs={12} sm={2}>
          {student.name}
        </Grid>
        <Grid item xs={12} sm={10}>
          <Box display="flex">
            {themes.map((theme) => renderTheme(theme, student))}
          </Box>
        </Grid>
      </Grid>
    );
  };

  const renderHead = (paragraph, themeIndex, paragraphIndex) => {
    const title = `${themeIndex + 1}.${paragraphIndex + 1}`;

    return (
      <Box
        width={1 / 30}
        style={{
          textAlign: "center",
          fontSize: 9,
          height: 30,
          backGroundColor: "#ccc"
        }}
      >
        {title}
      </Box>
    );
  };

  const renderHeader = (themes) => {
    return (
      <Grid container>
        <Grid item xs={12} sm={2}></Grid>
        <Grid item xs={12} sm={10}>
          <Box display="flex">
            {themes.map((theme, themeIndex) => {
              return theme.children.map((paragraph, paragraphIndex) =>
                renderHead(paragraph, themeIndex, paragraphIndex)
              );
            })}
          </Box>
        </Grid>
      </Grid>
    );
  };

  const render = () => {
    const themes = getChildrenOfItem(props.tree, props.currentParentId);
    const studentIds = [
      ...new Set(interactions.map((interaction) => interaction.user))
    ];

    return (
      <div>
        {renderHeader(themes)}
        {studentIds.map((studentId) => renderStudent(themes, studentId))}
      </div>
    );
  };

  return interactions && props.tree && props.group && render();
}
export default ThemeStats;
