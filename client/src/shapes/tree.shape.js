import { Resource } from "rest-hooks";
import { apiUrl } from "services/config";
import { userService } from "services/user";

export default class TreeResource extends Resource {
  _id = null;
  tree = {};

  pk() {
    return this._id;
  }

  static getKey() {
    return "TreeRESSRESOURCE2";
  }

  static fetchPlugin = request => {
    request.header.Authorization = userService.getAuthToken();
    return request;
  };

  //static urlRoot = `${apiUrl}/tree/rootTree/`;

  static url = urlParams => {
    if (urlParams) return `${apiUrl}/tree/rootTree`;
    // since we're overriding the url() function we must keep the type the
    // same, which means we might not get urlParams
    throw new Error("Comments require articleId to retrieve");
  };
}
