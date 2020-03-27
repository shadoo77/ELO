import { Resource } from "rest-hooks";
import { apiUrl } from "services/config";
import { userService } from "services/user";
import { tagLevels } from "services/config";

export default class ProgressResource2 extends Resource {
  // constructor() {
  //   super(...arguments);
  //   this._id = "";
  // }

  _id = "";
  group = {};
  stats = [];
  depthLevel = "";

  pk() {
    return `${this.depthLevel}_${this._id}`;
  }

  // since we won't be using urlRoot to build our urls we
  // still need to tell rest hooks how to uniquely identify this Resource
  static getKey() {
    return "PROGRESSRESOURCE2";
  }

  static fetchPlugin = request => {
    request.header.Authorization = userService.getAuthToken();
    return request;
  };

  static url = urlParams => {
    if (urlParams) {
      if (this.pk(urlParams) !== null) {
        return urlParams.depthLevel === tagLevels.THEME
          ? `${apiUrl}/progress/groupoverview/${urlParams.groupId}`
          : `${apiUrl}/progress/groupdetail/group/${urlParams.groupId}/parent/${urlParams.parentId}`;
      }
    }
    // since we're overriding the url() function we must keep the type the
    // same, which means we might not get urlParams
    throw new Error("Comments require articleId to retrieve");
  };
}
