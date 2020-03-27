import { Resource } from "rest-hooks";
import { apiUrl } from "services/config";
import { userService } from "services/user";

export default class ContentResource extends Resource {
  _id = null;

  pk() {
    return this._id;
  }

  static getKey() {
    return "Content_RESSRESOURCE2";
  }

  static fetchPlugin = request => {
    request.header.Authorization = userService.getAuthToken();
    return request;
  };

  static url = urlParams => {
    if (urlParams) return `${apiUrl}/content/alfa-content`;
    throw new Error("Comments require articleId to retrieve");
  };
}
