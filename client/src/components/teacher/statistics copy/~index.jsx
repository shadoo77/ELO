import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
// Actions
import { fetch_slideshows_of_group } from "../../../store/actions/groups.slideshows";
import { fetch_tree } from "../../../store/actions/tree";
// Components
import GroupContainer from "../../shared/group/Container";
import StatisticsContent from "./StatisticsContent.2";
import BreadCrumb from "./breadCrumb";
import SlideshowStatistics from "./SlideshowStatistics";
// Services
import { backendService } from "services/backend";
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

const spinner = () => {
  return (
    <Paper style={paperStyle}>
      <CircularProgress />
    </Paper>
  );
};

const Warner = ({ message }) => {
  return (
    <ListItem>
      <Typography variant="h6" component="h6">
        <center>{message}</center>
      </Typography>
    </ListItem>
  );
};

function StatisticsIndex(props) {
  const { groupId, branchId, studentId } = props.match.params;
  const { isLoading, hasFailed, errormessage, users } = props.slideshowsState;
  const { tree } = props.treeState;
  const [group, setGroup] = useState({});
  const [student, setStudent] = useState({});

  const temp = users && users.length && users[0] && users[0].slideShows;
  let depthLevel = searchInTree(tree, branchId, "depthLevel");
  if (!depthLevel) {
    const isSlideshow =
      temp && temp.length && temp.some((item) => item._id === branchId);
    depthLevel = isSlideshow ? "slideshow" : "NOT_FOUND";
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
    props.fetch_slideshows_of_group(branchId, groupId, studentId);
  }, []);

  // Component did update
  useEffect(() => {
    props.fetch_slideshows_of_group(branchId, groupId, studentId);
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

  return (
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
      {!hasFailed && isLoading ? (
        spinner()
      ) : !isLoading && hasFailed ? (
        <Warner message={errormessage} />
      ) : users && !users.length ? (
        <Warner message="Er zijn geen studenten!" />
      ) : student.error ? (
        <Warner message={student.error} />
      ) : depthLevel === "slideshow" ? (
        <SlideshowStatistics data={users} />
      ) : student.id ? (
        // Individuele student
        <StatisticsContent
          data={users}
          tree={tree}
          branchId={branchId}
          groupId={groupId}
          depthLevel={depthLevel}
          studentName={student.name}
        />
      ) : (
        // Hele groep
        <StatisticsContent
          data={users}
          tree={tree}
          branchId={branchId}
          groupId={groupId}
          depthLevel={depthLevel}
        />
      )}
    </GroupContainer>
  );
}

StatisticsIndex.propTypes = {
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
    fetch_slideshows_of_group: (branchId, groupId, studentId) =>
      dispatch(fetch_slideshows_of_group(branchId, groupId, studentId))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StatisticsIndex);
