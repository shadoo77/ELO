import React, { Suspense } from "react";
import { useResource, NetworkErrorBoundary } from "rest-hooks";
import { Redirect } from "react-router-dom";
// Shapes
import GroupDetailResource from "shapes/progress.group.detail";

// Components
import ThemeStatistics from "./stats/ThemeStatistics";
import ParagraphStatistics from "./stats/ParagraphStatistics";
import AssignmentStats from "./stats/AssignmentStats";
import SlideStats from "./stats/SlideStatistics";
import GroupContainer from "../../shared/group/Container";
import Spinner from "components/shared/spinner/";
import Warner from "components/shared/warner/";
import BreadCrumb from "./stats/utils/breadCrumb";
// Services
import { tagLevels } from "services/config";

function ErrorPage({ error }) {
  const errormsg = `STATISTICS INDEX ERROR : ${error.status} - ${error.response}, ${error.response.statusText}`;
  return <Warner message={errormsg} />;
}

export default props => {
  const { groupId, parentId, studentId, depthLevel } = props.match.params;

  const data = useResource(GroupDetailResource.detailShape(), {
    _id: groupId,
    groupId,
    parentId,
    depthLevel
  });

  const renderStatisticsLevel = () => {
    switch (depthLevel) {
      case tagLevels.THEME:
        return (
          <ThemeStatistics
            data={data}
            currentGroupId={groupId}
            currentStudentId={studentId}
          />
        );
      case tagLevels.PARAGRAPH:
        return (
          <ParagraphStatistics
            data={data}
            currentGroupId={groupId}
            currentStudentId={studentId}
          />
        );
      case tagLevels.ASSIGNMENT:
        return (
          <AssignmentStats
            data={data}
            currentGroupId={groupId}
            paragraphId={parentId}
            currentStudentId={studentId}
          />
        );
      case tagLevels.SLIDE:
        return (
          <SlideStats
            groupId={groupId}
            assignmentId={parentId}
            studentId={studentId}
          />
        );
      default:
        console.error("DEFAULT");
        return <Redirect to="/404" />;
    }
  };

  let studentName;

  if (studentId) {
    const isFound = data.group.students.some(el => el === studentId);
    if (isFound) {
      studentName = data.stats.find(el => el.user._id === studentId).user.name;
    }
  }

  return (
    <>
      <GroupContainer
        title={
          data.group && data.group.name
            ? `Statistieken ${studentName || "groep" + data.group.name}`
            : `Geen groep gevonden`
        }
        subtitle={
          <BreadCrumb
            data={data}
            parentId={parentId}
            groupId={groupId}
            depthLevel={depthLevel}
            studentId={studentId}
          />
        }
      >
        <Suspense fallback={<Spinner />}>
          <NetworkErrorBoundary fallbackComponent={ErrorPage}>
            {data && <div>{renderStatisticsLevel()}</div>}
          </NetworkErrorBoundary>
        </Suspense>
      </GroupContainer>
    </>
  );
};
