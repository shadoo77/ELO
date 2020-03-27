import { SimpleResource } from "rest-hooks";
import axios from "axios";
import { apiUrl } from "services/config";
import { userService } from "services/user";

export default class AssignmentResource extends SimpleResource {
  _id = null;
  assignment = {};
  attempt = 0;

  pk() {
    return this._id;
  }

  static fetchPlugin = (request) => {
    request.header.Authorization = userService.getAuthToken();
    return request;
  };

  static getRequestOptions() {
    return {
      dataExpiryLength: 60 * 60 * 1000,
      errorExpiryLength: Infinity,
      invalidIfStale: true
    };
  }

  static async fetch(method, url, body) {
    const res = await axios[method](url, body);
    return res.data;
  }

  static urlRoot = `${apiUrl}/assignment/id/`;
}
