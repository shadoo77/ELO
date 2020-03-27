import React, { useState, useEffect } from "react";
// Services
import { routeUrls } from "services/config";
import { backendService } from "services/backend";
import { tagLevels, difficultyTypes } from "services/config";
import { historyService } from "services/history";
// Material Ui components
import { Typography, Link, Breadcrumbs } from "@material-ui/core/";

export default (props) => {
  const { data, groupId, studentId, parentId, depthLevel } = props;

  // Click handler
  const handleStudentClick = (id, depthLevel) => {
    historyService.push(
      `${routeUrls.teacher.group.statistics}/group/${groupId}/branch/${id}/depthLevel/${depthLevel}`
    );
  };

  const basicElement = (thema) => {
    return [
      { id: thema.parent, value: data.group.name, depthLevel: tagLevels.THEME },
      {
        id: thema._id,
        value: `${thema.value}${
          thema.difficulty === difficultyTypes.BEGINNER
            ? "*"
            : thema.difficulty === difficultyTypes.INTERMEDIATE
            ? "**"
            : "***"
        }`,
        depthLevel: tagLevels.PARAGRAPH
      }
    ];
  };

  const getParCrumbs = (stats, parentId) => {
    //console.log("getParCrumbs parentId !!!!!!!! ", stats);
    //const temaTag = stats.find(el => el.parent._id === parentId).parent;
    const themaTag = stats.find((el) => el.parent._id === parentId);
    //console.log("temaTag temaTagtemaTagtemaTag CCCCCCCC ", themaTag);
    return basicElement(themaTag ? themaTag.parent : {});
  };

  const getAssCrumbs = (stats, parentId) => {
    const thema = stats.find((el) =>
      el.paragraphs.some((item) => item.tag._id === parentId)
    );
    const paragraph = thema.paragraphs.find((el) => el.tag._id === parentId)
      .tag;
    const crumpArray = basicElement(thema.parent);
    crumpArray.push({
      id: paragraph._id,
      value: paragraph.value,
      depthLevel: tagLevels.ASSIGNMENT
    });
    return crumpArray;
  };

  const getSlidesCrumbs = (stats, parentId) => {
    const thema = stats.find((el) =>
      el.assignments.some((item) => item.tag._id === parentId)
    );
    const crumpArray = basicElement(thema.parent);
    const assignment = thema.assignments.find((el) => el.tag._id === parentId)
      .tag;

    const paragraph = thema.paragraphs.find(
      (el) => el.tag._id === assignment.parent
    ).tag;
    crumpArray.push({
      id: paragraph._id,
      value: paragraph.value,
      depthLevel: tagLevels.ASSIGNMENT
    });
    crumpArray.push({
      id: assignment._id,
      value: assignment.value,
      depthLevel: tagLevels.SLIDE
    });
    return crumpArray;
  };

  const breadcrumbs = (data, depthLevel, parentId) => {
    switch (depthLevel) {
      case tagLevels.THEME:
        return [
          { id: parentId, value: data.group.name, depthLevel: tagLevels.THEME }
        ];
      case tagLevels.PARAGRAPH:
        return getParCrumbs(data.stats, parentId);
      case tagLevels.ASSIGNMENT:
        return getAssCrumbs(data.stats, parentId);
      case tagLevels.SLIDE:
        return getSlidesCrumbs(data.stats, parentId);
      default:
        return "DEFAULT";
    }
  };

  // Render Breadcrumb function
  function renderStudentBreadcrumbs() {
    const breadcrumbsLinks = breadcrumbs(data, depthLevel, parentId);
    return breadcrumbsLinks.map((el, i) => {
      return i === breadcrumbsLinks.length - 1 ? (
        <Typography color="textPrimary" key={el.id + "bread"}>
          {el.value}
        </Typography>
      ) : (
        <Link
          color="inherit"
          component="button"
          variant="body2"
          onClick={() => handleStudentClick(el.id, el.depthLevel)}
          key={el.id + "bread"}
        >
          {el.value}
        </Link>
      );
    });
  }

  return (
    <>
      <Breadcrumbs aria-label="Breadcrumb" style={{ margin: 10 }}>
        {/* {renderBreadcrumbs(groupLinks)} */}
        {/* {testFunc(data, parentId, depthLevel)} */}
        {renderStudentBreadcrumbs()}
      </Breadcrumbs>
      {/* {student.name ? (
        <Breadcrumbs aria-label="Breadcrumb" style={{ margin: 10 }}>
          {renderStudentBreadcrumbs(studentLinks)}
        </Breadcrumbs>
      ) : null} */}
    </>
  );
};
