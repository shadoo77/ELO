import { SimpleResource } from "rest-hooks";
import axios from "axios";
import { apiUrl, tagLevels } from "services/config";
import { userService } from "services/user";

export default class ProgressResource extends SimpleResource {
  userId = "";
  parentId = "";
  depthLevel = "";
  data = {};
  
  pk() {
    return `${this.depthLevel.toUpperCase()}_${this.userId}_${this.parentId}`;
  }

  // since we won't be using urlRoot to build our urls we
  // still need to tell rest hooks how to uniquely identify this Resource
  static getKey() {
    return "ProgressResourceThemeStudent";
  }

  static type = "read";

  static fetchPlugin = (request) => {
    request.header.Authorization = userService.getAuthToken();
    return request;
  };

  static getRequestOptions() {
    return {
      invalidIfStale: true
    };
  }

  static url = (urlParams) => {
    if (urlParams) {
      if (this.pk(urlParams) !== null) {
        return urlParams.depthLevel.toUpperCase() === tagLevels.PUBLICATION
          ? `${apiUrl}/progress/studentoverview/depth/${urlParams.depthLevel}`
          : `${apiUrl}/progress/studentdetail/parent/${
              urlParams.parentId
            }/depth/${urlParams.depthLevel.toLowerCase()}`;
      }
    }
    // since we're overriding the url() function we must keep the type the
    // same, which means we might not get urlParams
    throw new Error("Comments require articleId to retrieve");
  };

  static async fetch(method, url, body) {
    const res = await axios[method](url, body);
    return res.data;
  }

  // static urlRoot = `${apiUrl}/progress/studentoverview/`;
}
