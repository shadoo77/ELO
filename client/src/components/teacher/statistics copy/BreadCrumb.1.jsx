import React, { useState, useEffect } from "react";
// Services
import { routeUrls } from "services/config";
import { backendService } from "services/backend";
import { difficultyTypes } from "services/config";
// Material Ui components
import { Typography, Link, Breadcrumbs } from "@material-ui/core/";

import { historyService } from "services/history";
import { getBreadCrumbsValues } from "services/searchInTree";
import { LevelsOfNodeDepth } from "services/config";

export default (props) => {
  const { group, student, branchId, tree, depthLevel } = props;
  const [groupLinks, setGroupLinks] = useState([]);
  const [studentLinks, setStudentLinks] = useState([]);

  // Get breadcrumb's state
  async function getBreadcrumbsState() {
    let breadcrumbsGroupLinks = await getBreadCrumbsValues(tree, branchId);
    let breadcrumbsStudentLinks = await getBreadCrumbsValues(tree, branchId);
    if (breadcrumbsGroupLinks.length) {
      breadcrumbsGroupLinks[0].value = group.name;
    }
    if (breadcrumbsStudentLinks.length && student.name) {
      breadcrumbsStudentLinks[0].value = student.name;
    }
    if (depthLevel === LevelsOfNodeDepth.ASSIGNMENT) {
      const allSlideshows = await backendService.getSlideshows();
      allSlideshows.forEach((el) => {
        if (el._id === branchId) {
          breadcrumbsStudentLinks[breadcrumbsStudentLinks.length - 1].value +=
            el.difficulty === difficultyTypes.BEGINNER
              ? "*"
              : el.difficulty === difficultyTypes.INTERMEDIATE
              ? "**"
              : "***";
          breadcrumbsStudentLinks.push({ id: branchId, value: el.name });
        }
      });
    }
    setGroupLinks(breadcrumbsGroupLinks);
    setStudentLinks(breadcrumbsStudentLinks);
  }

  // Call breadcrump
  useEffect(() => {
    getBreadcrumbsState();
  }, [tree, branchId]);

  // Click handler
  const handleClick = (id) => {
    historyService.push(
      `${routeUrls.teacher.group.statusTest}/${group._id}/depth/${depthLevel}/branch/${id}`
    );
  };

  // Click handler
  const handleStudentClick = (id) => {
    historyService.push(
      `${routeUrls.teacher.group.statusTest}/${group._id}/depth/${depthLevel}/branch/${id}/student/${student.id}`
    );
  };

  // Render Breadcrumb function
  function renderBreadcrumbs(data) {
    // console.log("renderBreadcrumbs >>> ", data);
    return data.map((el, i) => {
      return i === data.length - 1 ? (
        <Typography color="textPrimary" key={el.id + "bread"}>
          {el.value}
        </Typography>
      ) : (
        <Link
          color="inherit"
          component="button"
          variant="body2"
          onClick={() => handleClick(el.id)}
          key={el.id + "bread"}
        >
          {el.value}
        </Link>
      );
    });
  }

  // Render Breadcrumb function
  function renderStudentBreadcrumbs(data) {
    return data.map((el, i) => {
      return i === data.length - 1 ? (
        <Typography color="textPrimary" key={el.id + "bread"}>
          {el.value}
        </Typography>
      ) : (
        <Link
          color="inherit"
          component="button"
          variant="body2"
          onClick={() => handleStudentClick(el.id)}
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
        {renderBreadcrumbs(groupLinks)}
      </Breadcrumbs>
      {student.name ? (
        <Breadcrumbs aria-label="Breadcrumb" style={{ margin: 10 }}>
          {renderStudentBreadcrumbs(studentLinks)}
        </Breadcrumbs>
      ) : null}
    </>
  );
};
