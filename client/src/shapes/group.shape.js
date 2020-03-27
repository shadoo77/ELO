import { Resource } from "rest-hooks";
import { apiUrl } from "services/config";
import { userService } from "services/user";

export default class GroupResource extends Resource {
  children = [];
  tag = {};
  user = "";
  __v = 0;
  _id = null;

  pk() {
    return this._id;
  }

  static fetchPlugin = (request) => {
    request.header.Authorization = userService.getAuthToken();
    return request;
  };

  static urlRoot = `${apiUrl}/group`;
}
