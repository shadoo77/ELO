import React, { Component } from "react";
// Redux
import { connect } from "react-redux";
// Tools
import update from "immutability-helper";
// Services
import { userService } from "../../../services/user";
import { backendService } from "../../../services/backend";
import { historyService } from "../../../services/history";
import { routeUrls } from "../../../services/config";
// Components
import StudentView from "../studentManager/StudentView";
// Material UI
import {
  CardHeader,
  Tooltip,
  Icon,
  FormHelperText,
  IconButton,
  Divider,
  Card,
  TextField,
  FormControl,
  FormGroup,
  Fab,
  FormLabel,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Grid
} from "@material-ui/core/";
import MoreVertIcon from "@material-ui/icons/MoreVert";

class GroupEdit extends Component {
  state = {
    action: "Save",
    errors: [],
    group: {
      _id: "",
      name: "",
      organisation: {
        _id: "",
        name: "",
        teachers: []
      },
      teachers: [],
      students: []
    },
    teacher: {
      _id: "",
      employers: [{ _id: "", name: "", teachers: [] }]
    }
  };

  async componentDidMount() {
    const groupId = this.props.match.params.id;
    try {
      const teacherId = await userService.getCurrentUserId();
      if (!teacherId) {
        throw new Error("TEACHER ID FAILED: ", teacherId);
      }

      const employers = await backendService.getEmployersOfTeacher(
        teacherId
      );

      if (!employers) {
        throw new Error("EMPLOYERS CANT BE FOUND");
      }

      const teacher = await employers.data[0].teachers.find(
        t => {
          return t._id === teacherId;
        }
      );

      this.setState(
        update(this.state, {
          group: {
            organisation: { $set: employers.data[0] },
            teachers: {
              $push: teacher ? [teacher] : [teacherId]
            }, // TODO: Why do we need this condition?!
            students: []
          },
          teacher: {
            _id: { $set: teacherId },
            employers: { $set: employers.data }
          }
        })
      );

      if (groupId) {
        const group = await backendService.getGroupById(
          groupId
        );
        this.setState(
          update(this.state, {
            action: { $set: "Update" },
            group: { $set: group.data[0] }
          })
        );
      }
    } catch (ex) {
      console.error("Caught: ", ex);
    }
  }

  async saveGroupHandler(event) {
    event.preventDefault();
    try {
      const added = await backendService.upsertGroup(
        this.state.group
      );
      if (added) {
        historyService.push(
          routeUrls.teacher.group.overview
        );
      }
    } catch (ex) {
      console.error(ex);
    }
  }

  cancelHandler() {
    historyService.push(routeUrls.teacher.group.overview);
  }

  nameChangeHandler(event) {
    const name = event.target.value;
    this.setState(
      update(this.state, {
        group: {
          name: { $set: name }
        }
      })
    );
  }

  async teacherChangeHandler(event) {
    // Persist
    const value = event.target.checked;
    const name = event.target.name;

    const stateIndex = this.state.group.teachers.findIndex(
      obj => obj === name
    );
    // Is teacher already in group.teachers list?
    if (value && stateIndex < 0) {
      // Nope, add them
      this.setState(
        update(this.state, {
          group: { teachers: { $push: [name] } }
        })
      );
    } else if (!value && stateIndex >= 0) {
      // Yes, remove them
      this.setState(
        update(this.state, {
          group: {
            teachers: { $splice: [[stateIndex, 1]] }
          }
        })
      );
    }
  }

  organisationChangeHandler(event) {
    const id = event.target.value;
    //const name = event.target.options[event.target.selectedIndex].text;
    const employer = this.state.teacher.employers.find(
      employer => {
        return employer._id === id;
      }
    );

    this.setState(
      update(this.state, {
        group: {
          organisation: {
            $set: employer
          },
          teachers: { $set: [this.state.teacher] }
        }
      })
    );
  }

  checkIfChecked(teacher) {
    return this.state.group.teachers.find(t => {
      return t === teacher._id;
    });
  }

  removeStudent(event, student) {
    event.preventDefault();

    const studentIndex = this.state.group.students.findIndex(
      obj => obj === student
    );

    this.setState(
      update(this.state, {
        group: {
          students: {
            $splice: [[studentIndex, 1]]
          }
        }
      })
    );
  }

  // async addStudent(event, name) {
  //   event.preventDefault();
  //   if (name.trim() === "") {
  //     return;
  //   }
  //   let acc = {
  //     account: {
  //       name: "Mark",
  //       account: {
  //         username: "1",
  //         password: "a" // TODO: bcrypt
  //       }
  //     }
  //   };
  //   const student = await backendService.addStudent(acc, this.state.group);
  //   if (student) {
  //     this.setState(
  //       update(this.state, {
  //         group: { students: { $push: [student] } }
  //       })
  //     );
  //   } else {
  //     console.error("Could not save student!");
  //   }
  // }

  render() {
    const groupId = this.props.match.params.id;

    return (
      <React.Fragment>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={6}>
            <Card style={{ padding: 12 }}>
              <CardHeader
                action={
                  <IconButton>
                    <MoreVertIcon />
                  </IconButton>
                }
                title="Groepen"
              />
              <Divider />
              <form>
                <Grid item sm={12} xs={12}>
                  <TextField
                    id="txtAddName"
                    name="txtAddName"
                    placeholder="VCIT1G4A"
                    fullWidth
                    value={this.state.group.name}
                    onChange={event => {
                      this.nameChangeHandler(event);
                    }}
                    margin="dense"
                    label="Groepsnaam"
                    required
                    error={
                      this.state.errors.groupNameEmpty
                        ? true
                        : false
                    }
                    helperText={
                      this.state.errors.groupNameEmpty
                    }
                  />
                  <FormHelperText htmlFor="txtAddName">
                    {this.state.errors
                      .groupNameEmpty ? null : (
                      <span
                        id="txtAddNameHelpBlock"
                        className="form-text text-muted"
                      >
                        Hoe heet de groep? Gebruik: "
                        <b>VCIT</b>
                        &lt;leerjaar&gt;&lt;opleiding&gt;&lt;lettercode&gt;"
                      </span>
                    )}
                  </FormHelperText>

                  <TextField
                    id="select"
                    select
                    label="Organisatie"
                    name={
                      this.state.group.organisation.name
                    }
                    value={
                      this.state.group.organisation._id
                    }
                    onChange={event => {
                      this.organisationChangeHandler(event);
                    }}
                    margin="normal"
                    fullWidth
                    style={{ marginTop: 35 }}
                    variant="outlined"
                  >
                    {this.state.teacher.employers.map(
                      organisation => (
                        <MenuItem
                          key={organisation._id}
                          value={organisation._id}
                        >
                          {organisation.name}
                        </MenuItem>
                      )
                    )}
                  </TextField>
                </Grid>

                {/* Checkboxes here      %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */}

                <FormControl component="fieldset">
                  <FormLabel component="legend">
                    Welke docenten geven er les aan deze
                    klas?
                  </FormLabel>
                  <FormGroup>
                    {this.state.group.organisation.teachers.map(
                      teacher => (
                        <FormControlLabel
                          key={teacher._id}
                          control={
                            <Checkbox
                              color="primary"
                              checked={
                                this.state.teacher._id ===
                                teacher._id
                                  ? true
                                  : this.state.group.teachers.find(
                                      t => {
                                        return (
                                          t === teacher._id
                                        );
                                      }
                                    )
                                  ? true
                                  : false
                              }
                              onChange={event => {
                                this.teacherChangeHandler(
                                  event
                                );
                              }}
                              id={teacher._id}
                              name={teacher._id}
                              disabled={
                                teacher._id ===
                                this.state.teacher._id
                                  ? true
                                  : false
                              }
                            />
                          }
                          label={teacher.name}
                        />
                      )
                    )}
                  </FormGroup>
                </FormControl>
                <FormGroup row>
                  <Tooltip title="Cancel">
                    <Fab
                      size="small"
                      variant="extended"
                      color="secondary"
                      onClick={event =>
                        this.cancelHandler(event)
                      }
                      name="cancel"
                    >
                      <Icon>cancel</Icon>
                      Annuleren
                    </Fab>
                  </Tooltip>
                  <Tooltip
                    title="Save updates"
                    style={{ marginLeft: "20px" }}
                  >
                    <Fab
                      size="medium"
                      variant="extended"
                      color="primary"
                      onClick={event => {
                        this.saveGroupHandler(event);
                      }}
                      name="save"
                    >
                      <Icon>save</Icon>
                      {" " + this.state.action}
                    </Fab>
                  </Tooltip>
                </FormGroup>
              </form>
            </Card>
          </Grid>
          <Grid item sm={6} xs={12} md={6}>
            <StudentView groupID={groupId} />
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    teacher: state.user
  };
};
export default connect(mapStateToProps)(GroupEdit);
