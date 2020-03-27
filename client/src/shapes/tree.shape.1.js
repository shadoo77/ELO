import { Resource } from "rest-hooks";
import { apiUrl } from "services/config";
import { userService } from "services/user";

export default class TreeResource extends Resource {
  _id = null;
  tree = {};

  pk() {
    return this._id;
  }

  static fetchPlugin = request => {
    request.header.Authorization = userService.getAuthToken();
    return request;
  };

  static urlRoot = `${apiUrl}/rootTree`;
}
