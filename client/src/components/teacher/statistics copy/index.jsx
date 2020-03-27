import React, { useState, useEffect, useRef, Suspense } from "react";
import { NetworkErrorBoundary } from "rest-hooks";
import { connect } from "react-redux";
import PropTypes from "prop-types";
// Actions
import { fetch_slideshows_of_group } from "../../../store/actions/groups.slideshows";
import { fetch_tree } from "../../../store/actions/tree";
// Components
import ThemeStats from "./stats/theme";
import ParapgraphStats from "./stats/paragraph";
import AssignmentStats from "./stats/assignment";
import GroupContainer from "../../shared/group/Container";
import BreadCrumb from "./BreadCrumb.1";
import Spinner from "components/shared/spinner/";
import Warner from "components/shared/warner/";
// Services
import { backendService } from "services/backend";
import { LevelsOfNodeDepth } from "services/config";
import isEmpty from "services/is-empty";
// Helpers
import { searchInTree } from "services/searchInTree";
// Material ui
import {
  ListItem,
  Typography,
  CircularProgress,
  Paper
} from "@material-ui/core/";
const paperStyle = {
  width: "100%",
  margin: "3px auto",
  padding: "10px",
  textAlign: "center"
};

function ErrorPage({ error }) {
  const errormsg = `${error.status} - ${error.response}, ${error.response.statusText}`;
  return <Warner message={errormsg} />;
}
function Statistics(props) {
  const { groupId, branchId, studentId, depth } = props.match.params;
  const { isLoading, hasFailed, errormessage, users } = props.slideshowsState;
  const { tree } = props.treeState;
  const [group, setGroup] = useState({});
  const [student, setStudent] = useState({});

  const temp = users && users.length && users[0] && users[0].slideShows;
  let depthLevel = searchInTree(tree, branchId, "depthLevel");
  if (!depthLevel) {
    const isSlideshow =
      temp && temp.length && temp.some((item) => item._id === branchId);
    depthLevel = isSlideshow ? LevelsOfNodeDepth.ASSIGNMENT : "NOT_FOUND";
  }

  // Fetch group
  async function getGroup(groupId) {
    const result = await backendService.getGroupById(groupId);
    if (result) {
      setGroup(result.data[0]);
    }
  }

  async function fetchTree() {
    const root = await backendService.getRoot();
    props.fetch_tree(root._id);
  }

  useEffect(() => {
    getGroup(groupId);
    fetchTree();
    props.fetch_slideshows_of_group(branchId, groupId, studentId, depth);
  }, []);

  // Component did update
  useEffect(() => {
    props.fetch_slideshows_of_group(branchId, groupId, studentId, depth);
  }, [branchId, groupId]);

  // Function which skip the first invocation
  function useEffectSkipFirst(fn, arr) {
    const isFirst = useRef(true);
    useEffect(() => {
      if (isFirst.current) {
        isFirst.current = false;
        return;
      }
      fn();
    }, arr);
  }

  useEffectSkipFirst(() => {
    if (studentId && users && users.length) {
      const currStudent = users
        .filter((el) => el._id === studentId)
        .map((el) => ({ id: el._id, name: el.name }));
      setStudent(
        currStudent.length ? currStudent[0] : { error: "Student not found!" }
      );
    } else setStudent({});
  }, [studentId, users]);

  const avatar = student.name
    ? [
        {
          name: student.name,
          avatar: student.name.trim().charAt(0)
        }
      ]
    : null;

  const renderStatisticsLevel = (depthLevel) => {
    console.log(group, "????????????????");
    switch (depthLevel) {
      case LevelsOfNodeDepth.PUBLICATION:
        return (
          <ThemeStats
            tree={tree}
            currentParentId={branchId}
            group={group}
            currentGroupId={groupId}
          />
        );
      case LevelsOfNodeDepth.THEMA:
        return <ParapgraphStats currentParentId={branchId} />;
      case LevelsOfNodeDepth.PARAGRAF:
        return (
          <AssignmentStats
            currentParentId={branchId}
            group={group}
            currentGroupId={groupId}
            currentStudentId={studentId}
          />
        );
      default:
        return null;
    }
  };

  return (
    // TODO: ADD SUSPENSE AND ERROR
    <GroupContainer
      title={
        group.name
          ? `Statistieken ${student.name || "groep" + group.name}`
          : `Geen groep gevonden`
      }
      subtitle={
        <BreadCrumb
          tree={tree}
          branchId={branchId}
          group={group}
          student={student}
          depthLevel={depthLevel}
        />
      }
      header={avatar}
      headerType={student.name && "avatar"}
    >
      <Suspense fallback={<Spinner />}>
        <NetworkErrorBoundary fallbackComponent={ErrorPage}>
          {!isEmpty(group) && renderStatisticsLevel(depthLevel)}
        </NetworkErrorBoundary>
      </Suspense>
    </GroupContainer>
  );
}

Statistics.propTypes = {
  fetch_slideshows_of_group: PropTypes.func.isRequired,
  treeState: PropTypes.object.isRequired,
  slideshowsState: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  treeState: state.tree,
  slideshowsState: state.groupsSlideshows
});

const mapDispatchToProps = (dispatch) => {
  return {
    fetch_tree: (parentId, targetId) =>
      dispatch(fetch_tree(parentId, targetId)),
    fetch_slideshows_of_group: (branchId, groupId, studentId, depth) =>
      dispatch(fetch_slideshows_of_group(branchId, groupId, studentId, depth))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Statistics);
