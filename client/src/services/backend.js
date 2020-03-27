import { apiUrl } from "./config";
import { httpService } from "./http";

/* Returns a list of organisation this user (teacher) belongs to */
async function getEmployersOfTeacher(teacherId) {
  try {
    return await httpService.get(`${apiUrl}/organisation/employ/${teacherId}`);
  } catch (ex) {
    console.error(ex);
  }
}

async function getTeachersEmployedBy(organisationId) {
  try {
    return await httpService.get(
      `${apiUrl}/organisation/${organisationId}/employees`
    );
  } catch (ex) {
    console.error(ex);
  }
}

async function getGroupById(id) {
  try {
    return await httpService.get(`${apiUrl}/group/${id}`);
  } catch (ex) {
    console.error(ex);
  }
}

async function upsertGroup(payload) {
  try {
    return await httpService.post(`${apiUrl}/group/`, payload);
  } catch (ex) {
    console.error(ex);
  }
}

async function addStudent(account, group) {
  // TODO: Add user with credentials instead of just a name
  // TODO: Could be an action?
  try {
    const result = await httpService.post(`${apiUrl}/group/student/`, {
      group,
      account
    });
    return result.data;
  } catch (ex) {
    //TODO: Show feedback on screen
    console.error(ex);
  }
}

// Get location of an organisation
async function getLocationsOfOrg(organisationId) {
  try {
    const result = await httpService.get(
      `${apiUrl}/location/${organisationId}`
    );
    return result.data;
  } catch (ex) {
    console.error(ex);
  }
}

// Get alfa root id
async function getAlfaRoot() {
  try {
    const result = await httpService.get(`${apiUrl}/tree/alfa`);
    return result.data;
  } catch (ex) {
    console.error(ex);
  }
}

// Get alfa root id
async function getRoot() {
  try {
    const result = await httpService.get(`${apiUrl}/tree/root`);
    return result.data;
  } catch (ex) {
    console.error(ex);
  }
}

// Get alfa root id
async function getSlideshows() {
  try {
    const result = await httpService.get(
      `${apiUrl}/content/slideshows/treeitems`
    );
    return result.data;
  } catch (ex) {
    console.error(ex);
  }
}

// async function getInteractions(assignmentId, studentId) {
//   try {
//     const result = await httpService.get(
//       `${apiUrl}/progress/interactions/assignment/${assignmentId}/student/${studentId}`
//     );
//     console.log("Slide component fetchAssignment ::::: ", result);
//     return result.data;
//   } catch (ex) {
//     console.error(ex);
//   }
// }

export const backendService = {
  getEmployersOfTeacher,
  getTeachersEmployedBy,
  getGroupById,
  upsertGroup,
  addStudent,
  getLocationsOfOrg,
  getAlfaRoot,
  getRoot,
  getSlideshows
  //getInteractions
};
