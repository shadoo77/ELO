import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Typography,
  Tab,
  Tabs,
  Divider,
  Icon,
  CircularProgress
} from "@material-ui/core/";

// Services
import { httpService } from "services/http";
import { apiUrl } from "services/config";

// Components
import StudentsList from "./StudentsList";
import GroupContainer from "../../../shared/group/Container";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    "aria-controls": `scrollable-force-tabpanel-${index}`
  };
}

const useStyles = makeStyles(theme => ({
  centerText: {
    display: "flex",
    alignItems: "center"
  },
  icon: {
    marginRight: theme.spacing()
  }
}));

export default function ScrollableTabsButtonForce(props) {
  const { id } = props.match.params;
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);

  // Fetching Students
  async function fetchingStudents() {
    setLoading(true);
    try {
      if (id) {
        const results = await httpService.get(`${apiUrl}/group/${id}`);
        if (results) {
          setStudents(results.data.students);
          setLoading(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchingStudents();
  }, []);

  ////// Activate / inactivate student
  const changeActivity = async (studentId, studentIsActivated) => {
    try {
      await httpService.put(`${apiUrl}/group/student-activate`, {
        std_isActivated: studentIsActivated,
        std_id: studentId
      });
      let studentsArr = [...students];
      const updateIndex = students.map(el => el._id).indexOf(studentId);
      studentsArr[updateIndex].isActivated = studentIsActivated;
      setStudents(studentsArr);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteStudent = async studentId => {
    try {
      await httpService.delete(`${apiUrl}/group/student-delete/${studentId}`);
      let studentsArr = [...students];
      const removeIndex = students.map(el => el._id).indexOf(studentId);
      studentsArr.splice(removeIndex, 1);
      setStudents(studentsArr);
    } catch (err) {
      console.log(err.response);
    }
  };

  function handleChange(event, newValue) {
    setValue(newValue);
  }

  function labelWithIcon(icon, label) {
    return (
      <Typography variant="subtitle2" className={classes.centerText}>
        <Icon className={classes.icon}>{icon}</Icon>
        {label}
      </Typography>
    );
  }

  return (
    <GroupContainer
      title="Studentsoverzicht"
      subtitle="Beheer hier alle studenten"
    >
      <Tabs
        value={value}
        onChange={handleChange}
        //variant="fullWidth"
        scrollButtons="on"
        indicatorColor="primary"
        textColor="primary"
        aria-label="scrollable force tabs example"
        //centered
      >
        <Tab
          style={{ width: "50%" }}
          label={labelWithIcon("unarchive", "Actief")}
          {...a11yProps(0)}
        />
        <Tab
          style={{ width: "50%" }}
          label={labelWithIcon("archive", "Gearchiveerd")}
          //icon={<FavoriteIcon />}
          {...a11yProps(1)}
        />
      </Tabs>
      <Divider />
      {/* <ExpandingSearchBox />   renderCase="active"  */}

      <TabPanel value={value} index={0}>
        {loading ? (
          <CircularProgress />
        ) : (
          <StudentsList
            students={students}
            changeActivity={changeActivity}
            renderCase="active"
          />
        )}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {loading ? (
          <CircularProgress />
        ) : (
          <StudentsList
            students={students}
            changeActivity={changeActivity}
            deleteStudent={deleteStudent}
            renderCase="inactive"
          />
        )}
      </TabPanel>
    </GroupContainer>
  );
}
