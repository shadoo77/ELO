import { Resource } from "rest-hooks";
import { apiUrl } from "services/config";
import { userService } from "services/user";

export default class ProgressResource extends Resource {
  _id = null;
  group = {};
  stats = [];

  pk() {
    return `${this.group}`;
  }

  static fetchPlugin = (request) => {
    request.header.Authorization = userService.getAuthToken();
    return request;
  };

  static urlRoot = `${apiUrl}/progress/groupoverview/`;
}
